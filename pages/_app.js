// import App from 'next/app'
import React, { useState } from 'react';
import firebase from '../firebase';
import 'firebase/storage';
import 'firebase/auth';
import Install from '../components/install';
import NotPanel from '../components/notification/notPanel';
function MyApp({ Component, pageProps }) {
    const [uploadProgress, setUploadProgress] = useState(0)
    const [nots, setNots] = useState([]);
    React.useEffect(() => {
        require('../index');
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                getChats(user.uid)
            }
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
                this.setState({ loading: false, chats: [] });
            }
        });
    }
    return <React.Fragment>
        {uploadProgress > 0 && <div className="progress" >
            <div className="progress-bar" role="progressbar" style={{ width: uploadProgress + '%' }} aria-valuenow={uploadProgress} aria-valuemin="0" aria-valuemax="100">{uploadProgress}%</div>
        </div>}
        <Install />
        {nots}
        <Component setUpload={task} {...pageProps} />
        <style jsx>{`
             .progress {
                 position : fixed;
                 top : 0;
                 height : 6px;
                 width : 100vw;
                 z-index: 2000
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