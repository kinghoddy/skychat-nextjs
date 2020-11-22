// import App from 'next/app'
import React, { useState } from 'react';
import firebase from '../firebase';
import 'firebase/storage';
import 'firebase/auth';
import Install from '../components/install';
import NotPanel from '../components/notification/notPanel';
import CallRoom from '../components/vc/callRoom'
import Toast from '../components/UI/Toast/Toast'
import { presentNot, requestNotPermission } from '../notification-api';
import Splashscreen from '../components/splashscreen';
function MyApp({ Component, pageProps }) {
    const [uploadProgress, setUploadProgress] = useState(0)
    const [callObj, setCallObj] = useState(null)
    const [nots, setNots] = useState([]);
    const [notifications, setNotifications] = useState(0);
    const [userData, setUserData] = useState({})
    const [toast, setToast] = useState(null)
    const [showSplash, setShowSplash] = useState(true)
    const [groups, setGroups] = useState([])
    React.useEffect(() => {
        require('../index');
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                getChats(user.uid);
                getGroups(user.uid);
                getNots(user.uid);
                watchCall(user.uid);
                setUserData(user)
            }
        });
        function checkLoaded() {
            return document.readyState === "complete" || document.readyState === "interactive";
        }
        setShowSplash(!checkLoaded())
        window.addEventListener('load', e => {
            setShowSplash(false)
        })
    }, []);
    React.useEffect(() => {
        // console.log(nots);
    }, [uploadProgress, nots])
    const task = (upTask) => {
        upTask.on('state_changed', (snapshot) => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(Math.floor(progress))

            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    break;
            }
        }, function (error) {
            setUploadProgress(0)
        }, function () {
            setUploadProgress(0)
        });
    }
    const getChats = (uid) => {
        const db = firebase.database();
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
                        chatsRef.child(cur + '/chats').limitToLast(1).on('value', snap => {
                            let d = {
                                seen: {}
                            }
                            for (let key in snap.val()) {
                                d = {
                                    header: 'New message',
                                    text: snap.val()[key].message,
                                    sender: snap.val()[key].sender,
                                    seen: { ...snap.val()[key].seen },
                                    date: snap.val()[key].date,
                                    key
                                }
                            }

                            if (!d.seen[uid] && d.sender !== 'time') {


                                for (let key in snapshot.val()) {
                                    if (key !== uid) {
                                        d.icon = snapshot.val()[key].profilePicture
                                        d.title = snapshot.val()[key].username;
                                        d.href = "/messages/t/" + key
                                        let n = <NotPanel  {...d} />
                                        chats.push(n);
                                        setNots([...chats])
                                    }
                                }
                            }
                        })
                    })

                })
            } else {
            }
        });
    }
    const getGroups = (uid) => {
        const db = firebase.database();
        var ref = db.ref("users/" + uid + "/groups");
        ref.on("value", s => {
            var chatArr = [];
            var chatsId = s.val();
            if (chatsId) {
                chatArr = Object.keys(chatsId);
                const chatsRef = firebase.database().ref('groups');
                const chats = [];
                chatArr.forEach(cur => {
                    chatsRef.child(cur + '/metadata').once('value', snapshot => {
                        chatsRef.child(cur + '/chats').limitToLast(1).on('value', snap => {
                            let d = {}
                            for (let key in snap.val()) {
                                d = {
                                    header: 'New message',
                                    text: snap.val()[key].message,
                                    sender: snap.val()[key].sender,
                                    seen: { ...snap.val()[key].seen },
                                    date: snap.val()[key].date,
                                    key
                                }

                                if (!d.seen[uid] && d.sender !== 'time') {
                                    if (key !== uid) {
                                        d.icon = snapshot.val().icon;
                                        d.title = snapshot.val().groupName;
                                        d.href = "/messages/g/" + cur
                                        let n = <NotPanel  {...d} />
                                        chats.push(n);
                                        setGroups([...chats])
                                    }
                                }
                            }
                        })
                    })

                })
            } else {
            }
        });
    }
    const getNots = uid => {
        let c = requestNotPermission();
        firebase.database().ref('users/' + uid + '/notification').limitToLast(10).on('value', s => {
            let n = [];
            for (let key in s.val()) {
                if (!s.val()[key].seen) {
                    let data = {
                        tag: key,
                        image: s.val()[key].icon,
                        body: s.val()[key].title,
                        data: {
                            pid: s.val()[key].link,
                            uid,
                            type: 'notification',
                            notificationKey: key
                        },
                        actions: [
                            {
                                action: 'viewPost', title: 'View Post',
                                icon: '/img/logo/logo_red.png'
                            },
                            {
                                action: 'close', title: 'Close',
                            }
                        ],
                    }
                    let d = document.createElement('div');
                    d.innerHTML = data.body;
                    data.body = d.textContent
                    if (c) {
                        let not = presentNot('Skychat', data);
                    } else console.log(c)
                    n.push(data)
                }
            }
            setNotifications(n.length)
        })
    }
    const watchCall = uid => {
        let c = requestNotPermission();
        firebase.database().ref('users/' + uid + '/calling').on('value', s => {
            if (s.val() && !s.val().isMine) {
                setCallObj(s.val());
                let data = {
                    tag: 'call',
                    image: s.val().caller.profilePicture,
                    body: 'Incoming call from ' + s.val().caller.username,
                    data: {
                        type: 'call',
                    },
                    requireInteraction: true,
                    actions: [
                        {
                            action: 'pickCall', title: 'Pick Call',
                            icon: '/img/logo/logo_red.png'
                        }
                    ],
                }
                if (c) presentNot('Skychat', data)
            }
            else setCallObj(null)
        })
    }
    const callFunc = {
        setToast: (toast) => {
            setToast(toast)
            setTimeout(() => {
                setToast(null)
            }, 8000)
        },
        close: () => { }
    }
    const notProps = {
        notifications,
        chats: nots.length
    }
    return <React.Fragment>
        {toast && <Toast>{toast}</Toast>}
        <Splashscreen hide={!showSplash} />
        {uploadProgress > 0 && <div className="progress" >
            <div className="progress-bar" role="progressbar" style={{ width: uploadProgress + '%' }} aria-valuenow={uploadProgress} aria-valuemin="0" aria-valuemax="100">{uploadProgress}%</div>
        </div>}
        {callObj && <React.Fragment>
            <div className="backdrop" />
            <div className="call" >
                <CallRoom {...callFunc} receiver={callObj.caller} userData={userData}  {...callObj} />
            </div>
        </React.Fragment>
        }
        {nots}
        {groups}
        <Install />
        <Component notProps={notProps} setUpload={task} {...pageProps} />
        <style jsx>{`
             .progress {
                 position : fixed;
                 top : 0;
                 height : 6px;
                 width : 100vw;
                 z-index: 2000
             }
             .call  {
                 height : 100vh;
                 width : 100%;
                 position : fixed;
                 z-index : 2000;
                 left : 50%;
                 transform: translateX(-50%);
                 max-width : 30rem
             }
        `}</style>
    </React.Fragment>
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp