import React from 'react';
import Link from 'next/link'
import ProfilePicture from '../UI/profilePicture';
import Router from 'next/router';
import firebase from '../../firebase';
import 'firebase/database';
import ChatList from './chatList';
import SwipableTab from '../UI/swipable-tab';
import GroupsLisView from './group/groupListView';
import Search from '../forms/search';
import FlipMove from 'react-flip-move'
import Spinner from '../UI/Spinner/Spinner';
class Chats extends React.Component {
    constructor(props) {
        super(props);
        this.watch = React.createRef()
    }
    state = {
        search: '',
        uid: '',
        tab: '',
        loadCount: 12,
        chats: [],
        searching: null,
        searchRes: []
    }
    componentDidUpdate() {
        if (this.props.uid !== this.state.uid) {
            this.setState({ uid: this.props.uid });
            this.getChats(this.props.uid);
        }
    }
    componentWillUnmount() {
        document.getElementById('chats').removeEventListener('scroll', this.loadMore, false);
    }
    componentDidMount() {
        const ud = JSON.parse(localStorage.getItem('skychatUserData'))
        if (ud) {
            this.setState({ uid: ud.uid })
            this.getChats(ud.uid);
            document.getElementById('chats').addEventListener('scroll', this.loadMore, false)
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
        const initChats = localStorage.getItem('skychatMessages')
        if (initChats) this.setState({ chats: JSON.parse(initChats) });
        const db = firebase.database();
        this.setState({ loading: true });
        var ref = db.ref("users/" + uid + "/chats");
        ref.on("value", s => {
            let chatArr = [];
            let chatsId = s.val();
            if (chatsId) {
                if (Object.fromEntries) {

                    let p = Object.fromEntries(Object.entries(s.val()).sort((a, b) => a[1].localeCompare(b[1]))
                        .filter((cur, i, arr) => !i || cur[1] !== arr[i - 1][1])
                    );
                    chatsId = p
                    ref.set(p)
                }
                chatArr = Object.values(chatsId)
                const chatsRef = firebase.database().ref('chats');
                const chats = [];
                chatArr.forEach(cur => {
                    chatsRef.child(cur + '/metadata').once('value', snapshot => {
                        chatsRef.child(cur + '/chats/').limitToLast(1).on('value', snap => {
                            if (!snap.val()) chatsRef.child(cur + '/chats/').push({
                                date: Date.now(),
                                sender: 'skychat',
                                message: 'You are now connected together. Enjoy messaging in the clouds '
                            })
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

                                if (chats.length >= chatArr.length - 1) {
                                    setTimeout(() => {
                                        this.setState({ chats, loading: false });
                                        localStorage.setItem('skychatMessages', JSON.stringify(chats))
                                    }, 500);
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
    search = (q) => {
        const chats = [...this.state.chats];
        const res = chats.map(cur => {
            let d = JSON.stringify(cur).toLowerCase();
            if (d.indexOf(q) > -1) return cur;
        }).filter(cur => cur !== undefined);
        this.setState({ searchRes: res, searching: q });
    }
    render() {
        let c = [...this.state.chats];
        c.sort((a, b) => b.date - a.date)

        return <div className="wrapper" ref={this.watch} >
            <nav id="mainNav" className="px-3 py-1 navbar  navbar-light   navbar-expand" >
                <button className="back-button mr-2" onClick={() => Router.push('/feed')} >
                    <i className="fa fa-arrow-left" />
                </button>
                <div className="navbar-brand" >
                    <ProfilePicture noBorder src={this.props.profilePicture} size="36px" />
                    {/* <small className="ml-2" >{this.props.username}</small> */}
                </div>
                <div className="collapse navbar-collapse" >
                    <ul className="navbar-nav ml-auto" >
                        <i className="nav-item" >
                            <button className="back-button" >
                                <i className="fa fa-ellipsis-h" />
                            </button>
                        </i>
                    </ul>
                </div>

            </nav>


            <div className="tabs" >
                <SwipableTab
                    type="tabs"
                    position="bottom"
                    activeColor="#f30"
                    onTabChanged={(id) => this.setState({ tab: id })}
                    tabNav={[{
                        id: 'chats',
                        text: <React.Fragment>
                            <i className="tab-icon fa fa-comment" />
                            <h6 className="tab-title" >Chats</h6>
                        </React.Fragment>
                    }, {
                        id: "groups",
                        text: <React.Fragment>
                            <i className="tab-icon fa fa-users" />
                            <h6 className="tab-title" >Groups</h6>
                        </React.Fragment>
                    }]}
                    tabContent={[
                        {
                            id: 'chats',
                            component: <React.Fragment>
                                <nav id="chatNav" className=" px-3 py-1 navbar  navbar-light   navbar-expand" >
                                    <div className="navbar-brand  " >
                                        <h4 className="mb-0 ml-2 text-capitalize" >Chats</h4>
                                        {this.state.loading && <div className="spinner">
                                            <Spinner fontSize="2px" />
                                        </div>}
                                    </div>
                                    <div className="collapse navbar-collapse" >
                                        <ul className="navbar-nav ml-auto" >

                                            <li className="nav-item" >
                                                <Link href="#" >
                                                    <a className="nav-link" >
                                                        <i className="fa fa-plus mr-1" />
                                                        <span className="pr-2" >
                                                            Start chat
                                                        </span>
                                                    </a>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </nav>
                                <Search
                                    cancel={() => this.setState({ searching: null })}
                                    onSubmit={this.search}
                                />
                                <FlipMove
                                    staggerDelayBy="100"
                                    enterAnimation="accordionVertical"
                                >
                                    {this.state.searching ? <React.Fragment>

                                        {this.state.searchRes.map(cur => <ChatList key={cur.id} {...cur} uid={this.props.uid} />)}
                                        <p className="text-center" >{this.state.searchRes.length > 0 ? 'No more results' :
                                            `No results found for  "${this.state.searching}"`}</p>
                                    </React.Fragment>
                                        : c.map((cur, i) => i < this.state.loadCount && <ChatList key={cur.id} {...cur} uid={this.props.uid} />)}
                                </FlipMove>
                                <div id='watch'>
                                    {!this.state.loading && !this.state.searching && <p className="text-center my-2"  >
                                        {this.state.chats.length > 0 ? 'No more chats' : 'No chats yet'}
                                    </p>}
                                </div>
                            </React.Fragment>
                        }, {
                            id: 'groups',
                            component: <GroupsLisView {...this.props} />
                        }
                    ]}
                />

            </div>
            <style jsx>{`
                .wrapper {
                    width : 100%;
                    display : flex;
                    flex-direction : column;
                    overflow : hidden;
                    position : relative;
                    height : 100%;
                    background : var(--gray);
                }
               .spinner {
                    height : 20px;
                    width : 20px;
                    margin : 0 10px;
                }
                .navbar-brand {
                    display : flex;
                    align-items : center;
                }
                .navbar-brand small {
                    font-weight : 600;
                    color : var(--gray-dark)
                }
                .nav-item {
                    margin : 0 5px;
                }
                .nav-link {
                    background : var(--light);
                    height : 40px;
                    padding : 0;
                    display : flex;
                    align-items : center;
                    justify-content : center;
                    min-width : 40px;
                    color : var(--black);
                    border-radius : 20rem;
                }
                #mainNav {
                    position : relative;
                    z-index : 500
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
                   .tabs {
                       position : absolute;
                       height : 100%;
                       transition : all .3s;
                       padding-top : 3.6rem;
                       width : 100%;
                    }
                    .tab-icon {
                        font-size : 30px;
                    }
                    .tab-title {
                        font-weight : 700;
                        margin-bottom : 0;
                    }
            `}</style>
            <style jsx global>{`
            body.dark .wrapper {
                background : #000
            }
            body.dim .wrapper {
                background : #001119;
            }
            `}</style>
        </div>
    }
}

export default Chats