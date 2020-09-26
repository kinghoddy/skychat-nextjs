import React, { Component } from 'react';
import ProfilePicture from '../UI/profilePicture';
import Link from 'next/link';
import firebase from '../../firebase';
import 'firebase/database';
import Chat from './chat.js'
import date from '../date';
import Router from 'next/router'
import Send from '../forms/send';
import play from '../Audio/Audio';

class Chatroom extends Component {
    constructor(props) {
        super(props);
        this.chats = React.createRef()
    }

    state = {
        userData: {},
        receiver: {
            username: ''
        },
        chatId: null,
        chats: []
    }
    componentDidUpdate() {

        if (this.state.id !== this.props.id) {
            this.setState({ id: this.props.id });
            this.getChat(this.props.id);
            this.getReceiverData(this.props.id);
        }
    }
    componentWillUnmount() {
        firebase.database().ref('chats/' + this.state.chatId + '/chats').off('value', this.loadChats, false);
        firebase.database().ref('chats/' + this.state.chatId + '/chats').off('child_added', this.play, false);
    }
    componentDidMount() {
        if (window.innerWidth < 1000) {
            this.setState({ isPhone: true })
        }

        const ud = JSON.parse(localStorage.getItem('skychatUserData'))
        if (ud) this.setState({ userData: ud });

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
                    profilePicture: s.val().profilePicture,
                }
                let d = {
                    receiver: { ...receiver }
                }
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
    getChat = (id) => {

        let chatId = this.state.userData.uid + '&' + id;
        if (id > this.state.userData.uid) {
            chatId = id + '&' + this.state.userData.uid
        }
        this.setState({ chatId })
        firebase.database().ref('chats/' + chatId + '/chats').limitToLast(1).on('child_added', this.play, false)
        let data = JSON.parse(localStorage.getItem('skychatChat=' + id))
        if (data) if (data.chats) this.setState({ chats: data.chats })
        setTimeout(() => {
            this.chats.current.scrollTop = this.chats.current.scrollHeight + 10000
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
        let data = JSON.parse(localStorage.getItem('skychatChat=' + this.props.id))
        let chats = [];
        for (let key in s.val()) {
            chats.push({
                ...s.val()[key],
                key
            })
            if (s.val()[key].seen) {
                if (!s.val()[key].seen[this.state.userData.uid]) {
                    firebase.database().ref('chats/' + id + '/chats/' + key + '/seen/' + this.state.userData.uid).set(Date.now())
                }
            }
        }
        let d = {
            chats: chats
        }
        if (data) {
            d = {
                ...data,
                chats: chats
            }
        }

        localStorage.setItem('skychatChat=' + this.props.id, JSON.stringify(d))
        this.setState({ chats: chats, chatLoaded: true });
        setTimeout(() => {

            if (this.chats.current) this.chats.current.scrollTop = this.chats.current.scrollHeight + 100
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
            <div className="wrap"  >
                <nav className="px-1 px-md-3 py-1  navbar bg-white sticky-top navbar-light  navbar-expand" >
                    <div className="navbar-brand  " >
                        <button className="d-lg-none text-dark nav-link mr-2" onClick={() => Router.push('/messages')} >
                            <i className="fa fa-arrow-left" />
                        </button>
                        <ProfilePicture online={this.state.receiver.online} src={this.state.receiver.profilePicture} size="40px" />
                    </div>
                    <div className="info" >
                        <h4 className="mb-0" >{this.state.isPhone ? this.state.receiver.username.substring(0, 11) : this.state.receiver.username}
                            {this.state.receiver.username.length > 11 && '...'}
                        </h4>
                        <small>
                            {this.state.receiver.online ? 'Active now' : 'Last seen ' + date(this.state.receiver.lastOnline, true)}
                        </small>
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
                                        <i className="fa fa-search" />
                                    </a>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>

                <div className="chats" ref={this.chats} >
                    <div className="mx-auto flex-column align-items-center d-flex mb-3" >
                        <ProfilePicture src={this.state.receiver.profilePicture} size='130px' online={this.state.receiver.online} />
                        <h1 className="my-2 h4 text-capitalize" >{this.state.receiver.fullName}</h1>
                    </div>
                    {this.state.chats.map((cur, i) => <Chat showImg={i === 0 ? true : i === this.state.chats.length - 1 ? true : this.state.chats[i + 1].sender !== cur.sender} {...cur} receiver={{ ...this.state.receiver }} />)}
                    {!this.state.chatLoaded && <div className="spinner" >
                        <div className="spinner-border" />
                    </div>}
                </div>
                <div className="form" >
                    <Send submit={this.send} />
                </div>
                <style jsx>{`
                         .wrap {
                    width : 100%;
                    height : 100%;
                    overflow : auto;
                    display : flex;
                    flex-direction : column;
                    background :var(--gray)  url(/img/chat-bg-light.jpg);
                    background-size: cover;
                }
                .navbar-brand {
                    display : flex;
                    align-items : center;
                }
                .info {
                    line-height : 1;
                }
                .info > h4 {
                    font-size : 18px;
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
            
                .chats {
                    overflow : auto;
                    height : calc(100vh - 4rem);
                    padding : 0 10px;
                    padding-top : calc(100vh - 30rem  );
                }
                .chats::-webkit-scrollbar {
                    width : 2px;
                }
                .chats > * {
                    flex-shrink : 0;
                }
                .form {
                }
                .spinner {
                    color : #f00;
                    text-align : center
                }
                @media (min-width : 1200px) {
                    .chats {
                        padding: 10px 10%;
                    padding-top : calc(100vh - 30rem  );
                    }
                       .chats::-webkit-scrollbar {
                    width : 8px;
                }
                }
                `}</style>
                <style jsx global>{`
                 body.dim  .wrap {
                    background :var(--gray)  url(/img/chat-bg-dim.jpg);
                  }
                 body.dark  .wrap {
                    background :var(--gray)  url(/img/chat-bg-dark.jpg);
                  }
                `}</style>
            </div>
        )
    }
}
export default Chatroom