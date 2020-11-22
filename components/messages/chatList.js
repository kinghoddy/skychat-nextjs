import React, { ref } from 'react';
import firebase from '../../firebase';
import 'firebase/database'
import ProfilePicture from '../UI/profilePicture';
import date from '../date';
import Link from '../UI/Link/link'
class ChatList extends React.Component {
    state = {
        chat: {},
        seen: true
    }
    componentDidUpdate() {
        if (this.props.uid !== this.state.uid) {
            this.setState({ uid: this.props.uid })
            this.getChat(this.props.uid)
        }
        if (this.props.seen !== this.state.seenObj) {
            this.setState({ seenObj: this.props.seen });
            this.getChat(this.props.uid)
        }
    }
    componentDidMount() {
        const ud = JSON.parse(localStorage.getItem('skychatUserData'))
        if (ud) this.getChat(ud.uid)
    }
    getChat = (uid) => {
        if (this.props.seen[uid]) this.setState({ seen: true })
        else {
            this.setState({ seen: false })
        }
        let md = { ...this.props.metadata }
        for (let keys in md) {
            if (keys !== uid) {
                let u = {
                    chatHead: md[keys].username,
                    uid: keys,
                    icon: md[keys].profilePicture
                }
                let a = JSON.parse(localStorage.getItem('chat=' + keys));
                if (a) u = a;
                this.setState({ chat: u })
                firebase.database().ref('users/' + keys).once('value', snap => {
                    let u = {
                        chatHead: snap.val().username,
                        uid: keys,
                        fullName: snap.val().fullName,
                        online: snap.val().connections,
                        icon: snap.val().profilePicture
                    }
                    localStorage.setItem('chat=' + keys, JSON.stringify(u))
                    this.setState({ chat: u })
                })
            }
        }

    }

    render() {
        return <Link activeClassName="active" href="/messages/t/[chatId]" as={"/messages/t/" + this.state.chat.uid} >
            <a className="con" >
                <ProfilePicture size="53px" src={this.state.chat.icon} online={this.state.chat.online} />
                <div className="ml-3" >
                    <h6 className="mb-0"  >{this.state.chat.chatHead}</h6>
                    {this.props.message.split && <p className="mb-0" >
                        <span className="text" dangerouslySetInnerHTML={{ __html: this.props.message.substring(0, 17) + (this.props.message.length > 17 ? '...' : '') }} ></span>
                        <b className="pl-2" >{date(this.props.date, true)} </b>
                    </p>}
                </div>
                {!this.state.seen && <div className="dot" />}
                <style jsx>{`
              .con {
                  display : flex;
                  align-items : center;
                  background : var(--white);
                  margin : 10px 15px;
                  border-radius : 10px;
                  box-shadow : 0 3px 10px #0002;
                  transition : all .3s;
                  padding : 7px  10px;
                }
                .con  * {
                    line-height: 1.3 !important;
              }
              .con:hover {
                  background: #f301;
              } 
              .active {
                  background : linear-gradient(to right , var(--warning)  ,#fff6 40%);
                  border-left : 3px solid var(--warning)
              }
              .con h6 {
                  font-weight : 700;
                  color :${this.state.seen ? 'var(--gray-dark)' : 'var(--black)'};
              }
              .con p {
                  color : ${this.state.seen ? 'var(--gray-dark)' : 'var(--black)'};
                  font-weight : ${this.state.seen ? '400' : 700};
                  font-size : 13px;
              }
              .con b {
                  color : var(--dark);
                  font-weight : 600;
                  font-size : 13px;
              }
              .text, .text *{
                  display : inline;
                  white-space : nowrap
              }
              .text br {
                  display : none
              }

              .dot {
                  align-self : stretch;
                   width : 35px;
                  background : linear-gradient(to right , #0000  , #f80a);
                  margin : -10px;
                  margin-left : auto;
                  border-radius : 10px;
                  position : relative;
                }
                .dot::after {
                    content : '';
                    position : absolute;
                    top : 50%;
                    left : 50%;
                    transform : translate(-50% , -50%);
                    border-radius : 50%;
                   background : none;
                  height : 15px;
                  width : 15px;
              }
            `}</style>
            </a>
        </Link>
    }
}

export default ChatList