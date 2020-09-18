import React from 'react';
import Link from 'next/link'
import ProfilePicture from '../UI/profilePicture';
import Router from 'next/router';
import firebase from '../../firebase';
import 'firebase/database';
import ChatList from './chatList';
import Spinner from '../UI/Spinner/Spinner';
class Chats extends React.Component {
    constructor(props) {
        super(props);
        this.watch = React.createRef()
    }
    state = {
        search: '',
        uid: '',
        loadCount: 10,
        chats: []
    }
    componentDidUpdate() {
        if (this.props.uid !== this.state.uid) {
            this.setState({ uid: this.props.uid });
            this.getChats(this.props.uid)
        }
    }
    componentWillUnmount() {
        this.watch.current.removeEventListener('scroll', this.loadMore, false);
    }
    componentDidMount() {
        const ud = JSON.parse(localStorage.getItem('skychatUserData'))
        if (ud) {
            this.setState({ uid: ud.uid })
            this.getChats(ud.uid);
            this.watch.current.addEventListener('scroll', this.loadMore, false)
        }
    }
    loadMore = () => {
        let count = this.state.loadCount;
        count += 10;
        const watch = document.getElementById("watch").getBoundingClientRect().top;
        if (watch <= window.innerHeight) {
            if (this.state.loadCount < this.state.chats.length) {
                this.setState({ loadCount: count });
            }
        }
    };
    getChats = (uid) => {
        const chats = localStorage.getItem('skychatMessages')
        if (chats) this.setState({ chats: JSON.parse(chats) })
        const db = firebase.database();
        this.setState({ loading: true });
        var ref = db.ref("users/" + uid + "/chats");
        ref.on("value", s => {
            var chatArr = [];
            var chatsId = s.val();
            if (chatsId) {
                for (let keys in chatsId) {
                    const cur = chatsId[keys];
                    chatArr.push(cur)
                }
                const chatsRef = firebase.database().ref('chats');
                const chats = [];
                chatArr.forEach(cur => {
                    chatsRef.child(cur + '/metadata').once('value', snapshot => {
                        chatsRef.child(cur + '/chats/').limitToLast(1).on('value', snap => {
                            for (let key in snap.val()) {
                                chats.forEach((current, i) => {
                                    if (current.id === cur) {
                                        chats.splice(i, 1);
                                    }
                                });
                                const di = document.createElement('div');
                                di.innerHTML = snap.val()[key].message;
                                chats.push({
                                    seen: {},
                                    metadata: snapshot.val(),
                                    ...snap.val()[key],
                                    message: di.textContent,
                                    id: cur,
                                });

                                if (chats.length >= chatArr.length) {
                                    localStorage.setItem('skychatMessages', JSON.stringify(chats))
                                    this.setState({ chats: chats, loading: false });
                                }
                            }
                        })
                    })

                })
            } else {
                this.setState({ loading: false, chats: [] });
            }
        });
    }
    render() {
        let c = this.state.chats;
        c.sort((a, b) => b.date - a.date)

        return <div className="wrapper" ref={this.watch}>
            <nav className="px-3 py-2 navbar sticky-top navbar-light p-0  navbar-expand" >
                <div className="navbar-brand  " >
                    <button className="nav-link mr-2" onClick={() => Router.push('/feed')} >
                        <i className="fa fa-arrow-left" />
                    </button>
                    <ProfilePicture src={this.props.profilePicture} size="30px" />
                    <h4 className="mb-0 ml-2" >Chats</h4>
                </div>
                <div className="collapse navbar-collapse" >
                    <ul className="navbar-nav ml-auto" >
                        <li className="nav-item" >
                            <Link href="#" >
                                <a className="nav-link" >
                                    <i className="fa fa-cog" />
                                </a>
                            </Link>
                        </li>
                        <li className="nav-item" >
                            <Link href="#" >
                                <a className="nav-link" >
                                    <i className="fa fa-plus" />
                                </a>
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
            <div className="px-3 " >
                {this.state.loading && <div className="spinner" >
                    <div className="spinner-grow mr-2 " />
                    Connecting....</div>}
                <form action="#" className="search" >
                    <input type="text" placeholder="Search..." value={this.state.search} onChange={e => this.setState({ search: e.target.value })} />
                    <button>
                        <i className="fal fa-search"></i>
                    </button>
                </form>
                {this.state.chats.map((cur, i) => i < this.state.loadCount && <ChatList key={cur.id} {...cur} uid={this.props.uid} />)}
                <div id='watch'>
                    {!this.state.loading && <p className="text-center my-2"  >
                        {this.state.chats.length > 0 ? 'No more chats' : 'No chats yet'}
                    </p>}
                </div>
            </div>
            <style jsx>{`
                .wrapper {
                    width : 100%;
                    height : 100%;
                    overflow : auto;
                    background : var(--white);
                }
                .navbar-brand {
                    display : flex;
                    align-items : center;
                }
                .nav-item {
                    margin : 0 5px;
                }
                .nav-link {
                    background : #0001;
                    height : 40px;
                    padding : 0;
                    display : flex;
                    align-items : center;
                    justify-content : center;
                    width : 40px;
                    border-radius : 50%;
                }
                .nav-link i {
                    font-size : 20px;
                }
                .spinner {
                    display : flex;
                    align-items : center;
                    justify-content : center
                }
                .spinner .spinner-grow {
                    color : #f20;
                }
                .search {
                       border-radius : 20px;
                       display : flex;
                       background : #ff220022;
                       overflow : hidden;
                       height : 2.5rem;
                       margin : 10px 0px;
                   }
                   .search > * {
                       align-self : stretch;
                       border : 0;
                       outline : 0;
                       background : none;
                       color : #000;
                       transition : all .3s;
                    }
                    .search input {
                        width : calc(100% - 35px);
                       padding : 0 15px;
                   }
                   .search button {
                       width : 35px;
                   }
                   .search button:hover {
                       background : #ff220044 ;
                   }

            `}</style>
        </div>
    }
}

export default Chats