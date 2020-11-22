import React, { Component } from 'react';
import ProfilePicture from '../UI/profilePicture';
import Link from 'next/link';
import firebase from '../../firebase';
import 'firebase/database';
import Chat from './chat.js'
import date from '../date';
import Router from 'next/router'
import Send from '../forms/send';
import CallRoom from '../vc/callRoom'
import play from '../Audio/Audio';
import Toast from '../UI/Toast/Toast'

class Chatroom extends Component {
    constructor(props) {
        super(props);
        this.chats = React.createRef()
    }

    state = {
        userData: {},
        receiver: {
            username: '',
            coverPhoto: '',
        },
        showCall: null,
        chatId: null,
        chats: [],
        count: -1
    }
    createCall = (type) => {
        this.setState({ showCall: type })
    }
    componentDidUpdate() {

        if (this.state.id !== this.props.id) {
            this.setState({ id: this.props.id });
            this.getChat(this.props.id);
            this.getReceiverData(this.props.id);
        }
    }
    componentWillUnmount() {
        this.chats.current.removeEventListener('scroll', this.loadMore);
        firebase.database().ref('chats/' + this.state.chatId + '/chats').off('value', this.loadChats, false);
        firebase.database().ref('chats/' + this.state.chatId + '/chats').off('child_added', this.play, false);
    }
    loadMore = () => {
        document.activeElement.blur();
        let c = this.state.count;
        const watch = document.getElementById('chat_watch').getBoundingClientRect().top
        const watch2 = this.chats.current.getBoundingClientRect().top - 200;
        if (watch > watch2) {
            if (c > 0) {
                c -= 10;
                this.setState({ count: c })
            }

        }
    }
    componentDidMount() {
        if (window.innerWidth < 1000) {
            this.setState({ isPhone: true })
        }
        const ud = JSON.parse(localStorage.getItem('skychatUserData'))
        if (ud) this.setState({ userData: ud });
        this.chats.current.addEventListener('scroll', this.loadMore, false)
    }
    getReceiverData = id => {
        let data = JSON.parse(localStorage.getItem('skychatChat=' + id))
        if (data) if (data.receiver) this.setState({ receiver: data.receiver })

        firebase.database().ref('users/' + id).once('value', s => {
            if (s.val()) {
                const receiver = {
                    username: s.val().username,
                    fullName: s.val().fullName,
                    uid: id,
                    online: s.val().connections,
                    lastOnline: s.val().lastOnline,
                    coverPhoto: s.val().coverPhoto,
                    profilePicture: s.val().profilePicture,
                }
                let d = {
                    receiver: { ...receiver }
                }
                let data = JSON.parse(localStorage.getItem('skychatChat=' + id))
                if (data) {
                    d = {
                        ...data,
                        receiver: { ...receiver }
                    }
                }
                localStorage.setItem('skychatChat=' + id, JSON.stringify(d))
                this.setState({ loading: false, receiver: receiver })
            }
        })
    }
    setToast = (toast) => {
        this.setState({ toast })
        setTimeout(() => {
            this.setState({ toast: null })
        }, 8000)
    }
    getChat = (id) => {

        let chatId = this.state.userData.uid + '&' + id;
        if (id > this.state.userData.uid) {
            chatId = id + '&' + this.state.userData.uid
        }
        this.setState({ chatId })
        firebase.database().ref('chats/' + chatId + '/chats').limitToLast(1).on('child_added', this.play, false)
        let data = JSON.parse(localStorage.getItem('skychatChat=' + id))
        if (data) if (data.chats) this.setState({ chats: data.chats, count: data.chats.length - 20 });

        setTimeout(() => {
            if (this.chats.current) this.chats.current.scrollTop = this.chats.current.scrollHeight + 10000
        }, 50)
        firebase.database().ref('chats/' + chatId + '/chats').on('value', this.loadChats, false)
    }
    play = s => {
        if (this.state.chatLoaded) {
            let sender = s.val().sender
            if (sender !== this.state.userData.uid && sender !== 'time' && sender !== 'skychat') play();
        }
    }
    loadChats = s => {
        let id = this.state.chatId;
        let chats = [];
        for (let key in s.val()) {
            if (s.val()[key].date) {

                chats.push({
                    ...s.val()[key],
                    key
                })
                if (s.val()[key].seen) {
                    if (!s.val()[key].seen[this.state.userData.uid]) {
                        firebase.database().ref('chats/' + id + '/chats/' + key + '/seen/' + this.state.userData.uid).set(Date.now())
                    }
                } else firebase.database().ref('chats/' + id + '/chats/' + key + '/seen/' + this.state.userData.uid).set(Date.now())
            }
        }
        let d = {
            chats: chats
        }
        let data = JSON.parse(localStorage.getItem('skychatChat=' + this.props.id));
        if (data) {
            d = {
                ...data,
                chats: chats
            }
        }
        localStorage.setItem('skychatChat=' + this.props.id, JSON.stringify(d))
        this.setState({ chats: chats, chatLoaded: true });
        setTimeout(() => {
            this.chats.current.scrollTop = this.chats.current.scrollHeight + 10000
        }, 50)
    }
    send = (e, text) => {
        var now = new Date();
        var currentTime = now.getTime();
        var lastTime = new Date().getTime();
        if (this.state.chats.length > 0) {
            lastTime = new Date(this.state.chats[this.state.chats.length - 1].date).getTime();
        }
        var difference = (currentTime - lastTime) / 1000;
        let chatId = this.state.userData.uid + '&' + this.props.id;
        if (this.props.id > this.state.userData.uid) {
            chatId = this.props.id + '&' + this.state.userData.uid
        }
        const ref = firebase.database().ref('chats/' + chatId)
        const post = {
            date: Date.now(),
            message: text,
            seen: {
                [this.state.userData.uid]: Date.now()
            },
            sender: this.state.userData.uid
        }
        const time = {
            date: Date.now(),
            message: Date.now(),
            sender: 'time'
        }
        if (text) {
            if (difference > 125) {
                ref.child('chats').push(time)
                ref.child('chats').push(post).then(() => play('sent'))
            } else ref.child('chats').push(post).then(() => play('sent'))
        } else {
            document.querySelector('.editor').focus()
        }
    }
    render() {

        return (
            <div className="wrap "  >
                {this.state.toast && <Toast>{this.state.toast}</Toast>}
                <nav className="px-1 px-md-3 py-1  navbar bg-white navbar-light  navbar-expand" >
                    <div className="navbar-brand  " >
                        <button className="d-lg-none text-dark nav-link mr-2" onClick={() => Router.replace('/messages')} >
                            <i className="fa fa-arrow-left" />
                        </button>
                        <ProfilePicture online={this.state.receiver.online} src={this.state.receiver.profilePicture} size="40px" />
                    </div>
                    <Link href='/[profile]' as={'/' + this.state.receiver.username} >
                        <a className="info" >
                            <h4 className="mb-0" >{this.state.isPhone ? this.state.receiver.username.substring(0, 11) : this.state.receiver.username}
                                {this.state.receiver.username.length > 11 && '...'}
                            </h4>
                            <small>
                                {this.state.receiver.online ? 'Active now' : 'Last seen ' + date(this.state.receiver.lastOnline, true)}
                            </small>
                        </a>
                    </Link>

                    <div className="collapse navbar-collapse" >
                        <ul className="navbar-nav ml-auto" >
                            <li className="nav-item" >
                                <button onClick={e => this.createCall('video')} className="nav-link" >
                                    <i className="fa fa-video" />
                                </button>
                            </li>
                            <li className="nav-item" >
                                <button onClick={() => this.createCall('voice')} className="nav-link" >
                                    <i className="fa fa-phone-alt" />
                                </button>
                            </li>
                            <li className="nav-item d-none d-md-block" >
                                <Link href="#" >
                                    <a className="nav-link" >
                                        <i className="fa fa-search" />
                                    </a>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
                <div className="split" >
                    <div className="chats" ref={this.chats} >
                        <div className="mx-auto flex-column align-items-center d-flex mb-3" >
                            <ProfilePicture src={this.state.receiver.profilePicture} size='130px' online={this.state.receiver.online} />
                            <h1 className="text-center px-2 my-2 h5 text-capitalize" >{this.state.receiver.fullName}</h1>
                        </div>
                        <div id='chat_watch' className="spinner" >
                            {!this.state.chatLoaded && <div className="spinner-border" />}
                        </div>
                        {this.state.chats.map((cur, i) => i > this.state.count && <Chat
                            showImg={i === 0 ? true : i === this.state.chats.length - 1 ? true : this.state.chats[i + 1].sender !== cur.sender}
                            {...cur}
                            receiver={{ ...this.state.receiver }} />)}


                    </div>
                    {this.state.showCall && <div className="wow fadeInUp faster call" >
                        <CallRoom setToast={this.setToast} userData={this.state.userData} receiver={{ ...this.state.receiver }} type={this.state.showCall} close={() => this.setState({ showCall: null })} />
                    </div>}
                </div>
                <div className="form" >
                    <Send submit={this.send} />
                </div>

                <style jsx>{`
                .wrap {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    background-size: cover;
                    background :var(--gray);
                }
                .navbar-brand {
                    display : flex;
                    align-items : center;
                }
                .info {
                    line-height : 1;
                }
                .info > h4 {
                    font-size : 14px;
                }
                .info small {
                    color: var(--gray-dark);
                    font-size : 12px;
                }
                .nav-item {
                    margin : 0 5px;
                }
                .nav-link {
                    background : #0001;
                    padding : 0;
                    display : flex;
                    align-items : center;
                    justify-content : center;
                    height : 35px;
                    width : 35px;
                    border-radius : 50%;
                }
                .nav-link i {
                    font-size : 15px;
                }
                .split {
                      position: relative;
                     z-index: 1;
                      flex: 1 1 0;
                      order: 2;
                }
                .form {
                     flex: none;
                     order: 3;
                     width: 100%;
                     min-height: 62px;
                }
                .chats {
                    overflow : auto;
                    padding : 0 10px;
                    width : 100%;
                    position : absolute;
                    top : 0;
                    left : 0;
                    display : flex;
                    flex-direction : column;
                    height : 100%;
                    padding-top : 5rem;
                }

                .chats::-webkit-scrollbar {
                    width : 2px;
                }

                .spinner {
                    color : #f00;
                    text-align : center
                }
                .call {
                    position : fixed ;
                    right : 0;
                    bottom : 0;
                    height : 100%;
                    background : var(--white);
                    z-index : 1500;
                    width : 100%;
                }
                @media (min-width : 1200px) {
                    .wrap {
                    border-left : 1px solid #ccc;
                    }
                    .chats {
                        padding: 10px  ${this.state.showCall ? '15px' : '10%'};
                        left : ${this.state.showCall ? '40%' : '0'};
                        width : ${this.state.showCall ? '60%' : '100%'};
                        padding-top : 5rem;
                    }
                       .chats::-webkit-scrollbar {
                    width : 20px;
                }
                .call {
                    position : static;
                    width : 40%;
                    overflow : hidden;
                }
                }
                `}</style>
                <style jsx global>{`
   
                 body.dim  .wrap {
                    background :#001119  url(/img/chat-bg-dim.jpg);
                  }
                 body.dark  .wrap {
                    background :#000  ;
                  }
                @media (min-width : 1200px) {
                 body.dim  .wrap {
                    border-left : 1px solid #333;
                 }
                 body.dark  .wrap {
                    border-left : 1px solid #333;
                 }
                }
                `}</style>
            </div>
        )
    }
}
export default Chatroom