import React from 'react';
import firebase from '../../firebase';
import 'firebase/database'
import ProfilePicture from '../UI/profilePicture';
import date from '../date';
import Link from 'next/link'
import play from '../Audio/Audio';
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
                this.setState({ chat: u })
                firebase.database().ref('users/' + keys).once('value', snap => {
                    let u = {
                        chatHead: snap.val().username,
                        uid: keys,
                        online: snap.val().connections,
                        icon: snap.val().profilePicture
                    }
                    this.setState({ chat: u })
                })
            }
        }

    }

    render() {
        return <Link href="/messages/t/[chatId]" as={"/messages/t/" + this.state.chat.uid} >
            <a className="con" >
                <ProfilePicture size="45px" src={this.state.chat.icon} online={this.state.chat.online} />
                <div className="ml-3" >
                    <h6 className="mb-0"  >{this.state.chat.chatHead}</h6>
                    {this.props.message.split && <p className="mb-0" >
                        {this.props.message.split("<div><br></div>")
                            .join(" ")
                            .substring(0, 21) + (this.props.message.length > 21 ? '...' : '')}
                        <b className="pl-2" >{date(this.props.date, true)} </b>
                    </p>}
                </div>
                {!this.state.seen && <div className="dot" />}
                <style jsx>{`
              .con {
                  display : flex;
                  align-items : center;
                  padding : 10px  0;
              }
              .con:hover {
                  background: #f301;
              } 
              .con h6 {
                  line-height: 10px;
                  font-weight : 700;
                  color :${this.state.seen ? 'var(--gray-dark)' : 'var(--black)'};
              }
              .con p {
                  color : ${this.state.seen ? 'var(--gray-dark)' : 'var(--black)'};
                  font-weight : ${this.state.seen ? '400' : 700}
              }
              .con b {
                  color : var(--dark);
                  font-weight : 600
              }
              .dot {
                  height : 15px;
                  width : 15px;
                  margin-left : auto;
                  background : var(--fav);
                  border-radius : 50%
              }
            `}</style>
            </a>
        </Link>
    }
}

export default ChatList