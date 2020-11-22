import React, { Component } from 'react';
import ProfilePicture from '../../UI/profilePicture';
import Link from 'next/link';
import firebase from '../../../firebase';
import 'firebase/database';
import Chat from './chat.js'
import date from '../../date';
import Router from 'next/router'
import Send from '../../forms/send';
import CallRoom from '../../vc/callRoom'
import play from '../../Audio/Audio';
import Toast from '../../UI/Toast/Toast'
import GroupInfo from './GroupInfo';
class Chatroom extends Component {
    constructor(props) {
        super(props);
        this.chats = React.createRef()
    }

    state = {
        userData: {},
        groupData: {
            name: ''
        },
        loading: false,
        members: {},
        showCall: null,
        chatId: null,
        chats: [],
        isMember: false
    }
    createCall = (type) => {
        this.setState({ showCall: type })
    }
    componentDidUpdate() {

        if (this.state.id !== this.props.id) {
            this.setState({ id: this.props.id });
            this.getChat(this.props.id);
            this.getGroupData(this.props.id);
        }
    }
    componentWillUnmount() {
        firebase.database().ref('groups/' + this.state.chatId + '/chats').off('value', this.loadChats, false);
        firebase.database().ref('groups/' + this.state.chatId + '/chats').off('child_added', this.play, false);
        firebase.database().ref('groups/' + this.state.chatId + '/metadata').off()
        firebase.database().ref('groups/' + this.state.chatId + '/members').off()
    }
    componentDidMount() {
        const ud = JSON.parse(localStorage.getItem('skychatUserData'))
        if (ud) this.setState({ userData: ud });
    }
    getGroupData = id => {
        let data = JSON.parse(localStorage.getItem('GroupChat=' + id))
        if (data) {
            if (data.groupData) this.setState({ groupData: data.groupData })
            if (data.members) {
                this.setState({ members: data.members })
                if (!data.members[this.state.userData.uid]) this.setState({ isMember: 'loading' })
                else this.setState({ isMember: true })
            }
        }

        firebase.database().ref('groups/' + id + '/metadata').on('value', s => {
            if (s.val()) {
                const groupData = {
                    name: s.val().groupName,
                    description: s.val().groupDescription,
                    icon: s.val().icon,
                    deepLink: s.val().deepLink,
                    createdBy: s.val().createdBy
                }
                data = JSON.parse(localStorage.getItem('GroupChat=' + id))

                let d = {
                    ...data,
                    groupData: { ...groupData }
                }
                localStorage.setItem('GroupChat=' + id, JSON.stringify(d))
                this.setState({ loading: false, groupData: groupData })
            }
        });
        // fetching members
        firebase.database().ref('groups/' + id + '/members').on('value', async s => {
            const mem = { ...s.val() };
            if (mem[this.state.userData.uid]) this.setState({ isMember: true });
            else {
                this.setState({ isMember: false });
                firebase.database().ref('groups/' + id + '/chats').off()
            }
            // update the member data from the db
            for (let uid in mem) {
                await firebase.database().ref('users/' + uid).once('value', sn => {
                    mem[uid].fullName = sn.val().fullName;
                    mem[uid].online = sn.val().connections;
                    mem[uid].profilePicture = sn.val().profilePicture;
                })
            }
            console.log(mem);
            data = JSON.parse(localStorage.getItem('GroupChat=' + id))
            let d = {
                ...data,
                members: { ...mem }
            }
            localStorage.setItem('GroupChat=' + id, JSON.stringify(d))
            this.setState({ members: mem });
        });
    }

    setToast = (toast) => {
        this.setState({ toast })
        setTimeout(() => {
            this.setState({ toast: null })


        }, 8000)
    }
    getChat = (id) => {
        let chatId = id
        this.setState({ chatId })
        firebase.database().ref('groups/' + chatId + '/chats').limitToLast(1).on('child_added', this.play, false)
        let data = JSON.parse(localStorage.getItem('GroupChat=' + id))
        if (data) if (data.chats) this.setState({ chats: data.chats })
        setTimeout(() => {
            if (this.chats.current) this.chats.current.scrollTop = this.chats.current.scrollHeight + 10000
        }, 50)
        firebase.database().ref('groups/' + chatId + '/chats').on('value', this.loadChats, false)
    }
    play = s => {
        if (this.state.chatLoaded) {
            let sender = s.val().sender
            if (sender !== this.state.userData.uid && sender !== 'time' && sender !== 'skychat') play();
        }
    }
    loadChats = s => {
        let id = this.state.chatId;
        let data = JSON.parse(localStorage.getItem('GroupChat=' + this.props.id))
        let chats = [];
        for (let key in s.val()) {
            if (s.val()[key].date) {

                chats.push({
                    ...s.val()[key],
                    key
                })
                if (s.val()[key].seen) {
                    if (!s.val()[key].seen[this.state.userData.uid]) {
                        firebase.database().ref('groups/' + id + '/chats/' + key + '/seen/' + this.state.userData.uid).set(Date.now())
                    }
                } else firebase.database().ref('groups/' + id + '/chats/' + key + '/seen/' + this.state.userData.uid).set(Date.now())
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
        localStorage.setItem('GroupChat=' + this.props.id, JSON.stringify(d))
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
        let chatId = this.props.id
        const ref = firebase.database().ref('groups/' + chatId)
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
        const memberString = 'You'

        return (this.state.isMember !== true ? <div className="checking" >
            {this.state.isMember === "loading" ? <div className="d-flex align-items-center" >
                <div className="spinner-border text-primary mr-3" /> <span>Please wait</span>
            </div> : <span>You are seeing this because you are not of member of this group or the group does not exist</span>}
            <style jsx>{`
                            .checking {
                    height : 100%;
                    display : flex;
                    align-items : center;
                    text-align : center;
                    padding : 15px;
                    justify-content : center;
                }

            `}</style>
        </div> : <div className="wrap "  >
                {this.state.toast && <Toast>{this.state.toast}</Toast>}
                <div className="split" >

                    <div className="chat_wrapper" >
                        <nav id="wrap_nav" className="px-1 px-md-3 py-1  navbar bg-white navbar-light  navbar-expand" >
                            <div className="navbar-brand  " >
                                <button className="d-lg-none text-dark nav-link mr-2" onClick={() => Router.replace('/messages')} >
                                    <i className="fa fa-arrow-left" />
                                </button>
                                <ProfilePicture noBorder online={this.state.online} src={this.state.groupData.icon} size="40px" />
                            </div>
                            <Link href={'/messages/g/[...groupid]'} as={'/messages/g/' + this.props.id + '/info'} >
                                <a className="info" >
                                    <h4 className="mb-0" >{this.state.isPhone ? this.state.groupData.name.substring(0, 18) : this.state.groupData.name}
                                        {this.state.groupData.name.length > 18 && this.state.isPhone && '...'}
                                    </h4>
                                    <small>
                                        {memberString}
                                    </small>
                                </a>
                            </Link>

                            <div className="collapse navbar-collapse" >
                                <ul className="navbar-nav ml-auto" >

                                    <li className="nav-item " >
                                        <Link href="#" >
                                            <a className="nav-link" >
                                                <i className="fa fa-search" />
                                            </a>
                                        </Link>
                                    </li>
                                    <li className="nav-item " >
                                        <Link href={'/messages/g/[...groupid]'} as={'/messages/g/' + this.props.id + '/info'} >
                                            <a className="nav-link" >
                                                <i className="fal fa-info" />
                                            </a>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </nav>

                        <div className="chats" ref={this.chats} >

                            <div className="mx-auto flex-column align-items-center d-flex mb-3" >
                                <ProfilePicture src={this.state.groupData.icon} size='130px' online={this.state.online} />
                                <h1 className="my-2 h4 text-capitalize" >{this.state.groupData.name}</h1>
                                <small>{this.state.groupData.description}</small>
                            </div>

                            {this.state.chats.map((cur, i) => <Chat
                                showImg={i === 0 ? true : i === this.state.chats.length - 1 ? true : this.state.chats[i + 1].sender !== cur.sender}
                                {...cur}
                                userData={this.state.userData}
                                senderObj={this.state.members[cur.sender]}
                            />)}
                            {!this.state.chatLoaded && <div className="spinner" >
                                <div className="spinner-border" />
                            </div>}

                        </div>
                        <div className="form" >
                            {this.state.isMember ? <Send submit={this.send} /> : <div className="notMember" >
                                You are not a member of this group
                            </div>}
                        </div>
                    </div>
                    {this.props.extraView && <div className="extra_wrapper" >
                        {this.props.extraView === 'info' && <GroupInfo
                            members={this.state.members}
                            id={this.props.id}
                            cancel={() => Router.push('/messages/g/' + this.props.id)}
                            metadata={this.state.groupData}
                            userData={this.state.userData}
                        />}
                    </div>}
                </div>

                <style jsx>{`
                   .wrap {
                    display: flex;
                    flex-direction: column;
                    border-left : 1px solid #ccc;
                    height: 100%;
                    background :var(--gray);
                    background-size: cover;
                    animation : in .5s .3s ease-in both
                }
                @keyFrames in {
                    from {
                        opacity : 0;
                        visibility : hidden
                    }
                    to {
                        opacity : 1;
                        visibility : visible
                    }
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
                       display :flex;
                       height : 50%;
                       flex : 1;
                }
                .split > * {
                   max-width : 100%;
                }
                .chat_wrapper {
                    height : 100%;
                    position: relative;
                    z-index: 1;
                    flex : 1;
                    display : flex;
                    flex-direction : column;
                }
                .extra_wrapper {
                    background : var(--gray);
                   position : fixed;
                   bottom : 0;
                   z-index : 1300;
                   height : 100vh;
                   width : 100vw;
                   left : 0;
                }
                .form {
                     width: 100%;
                     min-height: 62px;
                }
                .chats {
                    overflow : auto;
                    padding : 0 10px;
                    width : 100%;
                    flex : 1;
                    padding-top : 5rem;
                }
                .chats > * {
                   
                }
                .chats::-webkit-scrollbar {
                    width : 2px;
                }

                .spinner {
                    color : #f00;
                    text-align : center
                }
                .notMember {
                    background : var(--light);
                    text-align : center;
                     display : flex;
                     padding : 10px;
                     justify-content : center;
                     margin : 10px;
                     border-radius : 10px;
                     align-items : center;
                }
  
                @media (min-width : 1200px) {
                    .chats {
                        padding: 10px  ${this.state.showCall ? '15px' : '10%'};
                        left : ${this.state.showCall ? '40%' : '0'};
                        width : ${this.state.showCall ? '60%' : '100%'};
                        padding-top : 5rem;
                    }
                       .chats::-webkit-scrollbar {
                    width : 20px;
                }
                .extra_wrapper {
                width : 40%;
                height : 100%;
                position : static;
                z-index : 1;
                }
     
                }
                `}</style>
                <style jsx global>{`
                 body.dim  .wrap {
                    background :#001119 ;
                    border-left : 1px solid #333;
                  }
                  body.dim .extra_wrapper{
                    background :#001119 ;
                  }
                  body.dark .extra_wrapper {
                      background : #000;
                  }
                 body.dark  .wrap {
                    background :#000  ;
                    border-left : 1px solid #333;
                  }
                `}</style>
            </div>
        )
    }
}
export default Chatroom

// https://skychat.tk/j/FMlk160518556535
// "https://skychat.tk/j/FMlk1605185565357"