import React, { useState } from 'react';
import ProfilePicture from './UI/profilePicture';
import Img from './UI/img/img'
import Link from 'next/link'
import firebase from '../firebase';
import 'firebase/database'
import Toast from './UI/Toast/Toast'
const CoverProfile = props => {
    const [friends, setFriends] = useState(false);
    const [reqSent, setReqSent] = useState(false);
    const [toast, setToast] = useState(null);
    const [reqExists, setReqExists] = useState(false);
    const [loaded, setLoaded] = useState(false)

    // functions
    const checkFriend = (uid) => {
        const friends = { ...props.friendsId };
        const req = { ...props.requestsId };
        if (req[uid]) setReqSent(true)
        for (let key in friends) {
            if (friends[key] === uid) {
                setFriends(true);
            }
        }
        const ref = firebase.database().ref('users/' + props.uid);
        ref.child('requestsId').on('value', s => {
            let requests = { ...s.val() }
            if (requests[uid]) setReqSent(true);
            else setReqSent(false);
        })
        ref.child('friendsId').on('value', s => {
            let f = { ...s.val() };
            setFriends(false);
            for (let key in f) {
                if (f[key] === uid) setFriends(true)
            }
        })
        firebase.database().ref('users/' + uid + '/requestsId').on('value', s => {
            let request = { ...s.val() }
            if (request[props.uid]) setReqExists(true);
            else setReqExists(false);
        })
    }
    const sendRequest = () => {
        setToast(null)
        var ref = firebase.database().ref("users/" + props.uid + "/requestsId/" + props.userData.uid);
        if (reqSent) {
            ref.remove().then(() => {
                setToast('Request Canceled')
            })
            setReqSent(false)
        } else {
            ref
                .set(Date.now())
                .then(res => {
                    setToast('Request Sent')
                })
            setReqSent(true)
        }
    };
    const confirmRequest = () => {

        let chatId = null;
        if (props.uid > props.userData.uid) {
            chatId = props.uid + '&' + props.userData.uid;
        } else {
            chatId = props.userData.uid + '&' + props.uid;
        }
        // define Refs
        const db = firebase.database();
        const ref = db.ref("users/" + props.uid);
        const myRef = db.ref("users/" + props.userData.uid);
        const chatsRef = db.ref("chats/" + chatId);
        // Clearing Requests;
        ref.child('requestsId/' + props.userData.uid).remove();
        myRef.child('requestsId/' + props.uid).remove();
        setReqExists(false);
        setFriends(true);
        //  Set friends and Chats IDs
        ref.child("friendsId").push(props.userData.uid);
        ref.child("chats").push(chatId);
        myRef.child("friendsId").push(props.uid);
        myRef.child("chats").push(chatId);

        // Setup Chatting

        chatsRef.set({
            metadata: {
                [props.userData.uid]: {
                    profilePicture: props.userData.profilePicture,
                    username: props.userData.username
                },
                [props.uid]: {
                    profilePicture: props.profilePicture,
                    username: props.username
                }
            },

        })
        chatsRef.child('chats').push({
            message:
                "You are now connected together. Enjoy chatting in the cloud ",
            sender: "skychat",
            date: Date.now()
        })
        // Send Accepted notification 
        let n = {
            title: props.userData.username + ' Accepted Your Friend Request',
            icon: props.userData.profilePicture,
            link: '/' + props.userData.username,
            date: Date.now()
        }
        ref.child('notification').push(n)
    }
    const share = async () => {
        setToast(null)
        const shareData = {
            title: props.fullname,
            text: "I'm @" + props.username + ' on skychat. \n Check out my profile \n',
            url: 'https://skychat.vercel.app/' + props.username,
        }
        try {
            await navigator.share(shareData);
            setToast('Shared Successfully')
        } catch (err) {
            setToast('Error: ' + err);
        }
    }
    React.useEffect(() => {
        const ud = JSON.parse(localStorage.getItem('skychatUserData'))
        if (ud) {

            checkFriend(ud.uid)
        }

        setLoaded(true)
    }, [props.uid])
    return <div className="con" >
        {toast && <Toast>
            {toast}
        </Toast>}
        <div className="cover">
            {loaded && <Img src={props.coverPhoto} />}
        </div>
        <div className="profile">
            {loaded && <ProfilePicture color="var(--white)" size="120px" src={props.profilePicture} online={props.connections} />}
            <div className="names">

                <h3>{props.fullName}</h3>
                <h5>{props.username}</h5>
            </div>
            {!props.loggedOut && <div className="d-none d-lg-flex ml-auto">
                {reqExists && !friends && <button onClick={confirmRequest} className="btn btn-sm btn-fav" >
                    <i className="fal fa-user-check mr-2" />
            Confirm Request
            </button>}
                {!friends && !reqExists && !props.isMine && <button onClick={sendRequest} className="btn btn-sm btn-fav" >
                    <i className="fa fa-user-plus mr-3" />
                    {reqSent ? 'Cancel Request' : 'Add friend'}</button>}
                {!props.isMine && friends && <Link href={"/messages/t/[chatId]"} as={"/messages/t/" + props.uid} >
                    <a className="btn btn-sm btn-outline-dark mx-2" >
                        <i className="fal fa-comments mr-3" />
               Message</a>
                </Link>}
                {props.isMine && <Link href="/menu/edit-profile" >
                    <a className="btn btn-sm btn-outline-dark" >
                        <i className="mr-2 fal fa-edit" />Edit Profile
                </a>
                </Link>}
                <button className="btn btn-sm btn-outline-warning mx-2" onClick={share} >
                    <i className="mr-2 fal fa-share-alt" />Share Profile
                </button>
            </div>
            }
        </div>
        {!props.loggedOut && <div className="d-lg-none d-flex justify-content-around px-2 pb-3 pt-2" >

            {reqExists && <button onClick={confirmRequest} className="btn btn-sm btn-fav" >
                <i className="fal fa-user-check mr-2" />
            Confirm Request
            </button>}
            {!friends && !props.isMine && !reqExists && <button onClick={sendRequest} className="btn btn-sm btn-fav" >
                <i className="fa fa-user-plus mr-3" />
                {reqSent ? 'Cancel Request' : 'Add friend'}</button>}
            {!props.isMine && friends && <Link href={"/messages/t/[chatId]"} as={"/messages/t/" + props.uid}>
                <a className="btn btn-sm btn-outline-dark " >
                    <i className="fal fa-comments mr-3" />
               Message</a>
            </Link>
            }
            {props.isMine && <Link href="/menu/edit-profile" >
                <a className="btn btn-sm btn-outline-dark" >
                    <i className="mr-2 fal fa-edit" />Edit Profile
                </a>
            </Link>}
            <button className="btn btn-sm btn-outline-warning" onClick={share} >
                <i className="mr-2 fal fa-share-alt" />
                <span className="d-none d-md-inline" >Share Profile</span>
            </button>

        </div>}

        <style jsx>{`
        .con {
            position : relative;
            box-shadow: 0 0px 3px 2px #0001;
            background : var(--white);
            padding : 1px;
        }
        .cover {
            height : 15rem;
            margin : 10px;
            overflow : hidden;
            border-radius : 15px;
        }
        .profile {
            display : flex;
            padding : 10px;
            padding-left :10%;
            margin-top : -5rem;
            align-items : flex-end
        }
        
        .names {
            margin-top :75px;
            padding : 0 10px;
        }
        .names > h3 {
            margin-bottom : 0;
            font-weight: 600;
            font-size: 20px;
        }
        .names h5 {
            font-weight : 400;
            font-size : 13px;
            margin-bottom : 0;
            text-transform : capitalize;
        }
        @media (min-width : 1200px) {
            .cover {
                height : 50vh
            }
        }
        `}</style>
    </div>
}

export default CoverProfile