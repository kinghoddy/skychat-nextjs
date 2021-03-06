import React from 'react';
import Head from 'next/head';
import firebase from '../../firebase';
import 'firebase/auth';
import 'firebase/database';
import RouterLoader from '../UI/routerLoader';
import Router from 'next/router'
import Chats from '../messages/chats';

class Message extends React.Component {
    state = {
        userData: {
            username: '',
            profilePicture: ''
        },
        isPhone: false,
    }
    componentDidMount() {
        this.loadUserData();
        if (window.innerWidth < 1200) {
            this.setState({ isPhone: true })
        } else {
            this.setState({ isPhone: false })
        }
    }
    loadUserData = () => {
        let ud = localStorage.getItem("skychatUserData");
        if (ud) this.setState({ userData: JSON.parse(ud) })

        this.setState({ loading: true });
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                localStorage.setItem("hasUsedSkychat", true);
                firebase.database().ref('users/' + user.uid).once('value', s => {

                    const updatedUd = {
                        username: s.val().username,
                        profilePicture: s.val().profilePicture,
                        coverPhoto: s.val().coverPhoto,
                        fullName: s.val().fullName,
                        uid: user.uid
                    };
                    localStorage.setItem("skychatUserData", JSON.stringify(updatedUd));
                    // fetch the profile data
                    this.setState({
                        userData: updatedUd,
                        loading: false,
                    })
                });
            } else {
                localStorage.removeItem('skychatUserData');
                localStorage.removeItem("skychatFeed");
                localStorage.removeItem("hasUsedSkychat");
                this.setState({ loggedOut: true });
                if (!this.props.stay) Router.push("/login");
            }
        });
    };
    render() {
        return <div className="wrapper position-relative ">
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <meta name="HandheldFriendly" content="true" />
                <title>{this.props.title}</title>
                <meta property="og:title" content={this.props.title} />
                <link rel="shortcut icon" href="/img/logo/logo_blue.png" />
                <meta property="og:image" content={this.props.src ? this.props.src : "/img/logo/logo_blue.png"} />
            </Head>
            <RouterLoader noShow />

            <div className="row no-gutters h-100 " >
                <div className=" chat h-100">
                    <Chats {...this.state.userData} />
                </div>
                <div className={" chatroom " + (this.props.chatting ? 'chatting' : '')} >
                    {this.props.children}
                </div>
            </div>
            <style jsx>{`
                   .wrapper {
                        background : #f7f8fc;
                        height : 100vh;
                   }
                   .chat {
                       flex : 0 0 100%;
                       width : 100vw
                   }
                   .chatroom {
                       display : none;
                       flex  : 1;
                   }
          
                   .chatting {
                       position : absolute;
                       bottom : 0;
                       left :0;
                       width : 100vw;
                       height : 100%;
                       display : block;
                       z-index : 1300;
                   }
                   @media (min-width : 1200px) {
                       .chat {
                           flex : 0 0 27%;
                           width : 30vw
                       }
                       .chatroom {
                           display : block;
                       }
                       .chatting {
                           position : static;
                           z-index : 1;
                       }
                   }
                `}</style>
        </div>
    }
}
export default Message