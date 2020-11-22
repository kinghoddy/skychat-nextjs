import React from 'react';
import Ppicture from '../UI/profilePicture';
import Link from 'next/link';
import Images from '../posts/media';
import firebase from '../../firebase';
import 'firebase/storage';
import 'firebase/database';
import Toast from '../UI/Toast/Toast';
import play from '../Audio/Audio'
import Modal from '../UI/modal';

export default class AddPost extends React.Component {
    state = {
        show: false,
        form: {
            body: ''
        },
        tempSrc: []
    }
    changed = (e, type) => {
        let f = { ...this.state.form }
        f[type] = e.target.value;
        this.setState({ form: f })
    }
    addMedia = () => {
        this.setState({ toast: null })
        const fileInp = document.createElement('input');
        fileInp.type = 'file';
        fileInp.setAttribute('accept', 'video/*,image/*')
        fileInp.multiple = true;
        fileInp.click();
        fileInp.onchange = e => {
            const imgTypes = ['png', 'jpg', 'jpeg', 'gif'];
            const vidTypes = ['mp4', 'mpeg', 'webm', 'ogg'];
            let files = Array.from(fileInp.files);
            let tempSrc = [];
            files.forEach(cur => {
                let cname = cur.name.toLowerCase().split('.');
                let d = {
                    file: cur,
                    src: URL.createObjectURL(cur)
                }
                if (imgTypes.indexOf(cname[cname.length - 1]) > -1) {
                    tempSrc.push({
                        ...d,
                        type: 'image'
                    })
                } else if (vidTypes.indexOf(cname[cname.length - 1]) > -1) {
                    tempSrc.push({
                        ...d,
                        type: 'video'
                    })
                } else {
                    this.setState({ toast: 'File format not supported' })
                }
            })
            this.setState({ tempSrc })
            console.log(tempSrc);
        }
    }
    uploadTask = (file, callback, type) => {
        // Upload file and metadata to the object 'images/mountains.jpg'
        this.setState({ toast: null });
        if (file.size < 15000000) {
            let n = Date.now();
            var uploadTask = firebase
                .storage()
                .ref(this.props.username)
                .child('_' + n).put(file)
            this.props.setUpload(uploadTask, 'Uploading Post')

            uploadTask.on(
                firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                (snapshot) => {
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    const progressMsg = "Upload is " + Math.floor(progress) + "% done";
                    this.setState({ toast: 'uploading' });
                },
                function (error) {
                },
                () => {
                    // Upload completed successfully, now we can get the download URL
                    if (type === 'image') {
                        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                            callback(url.split(n).join(n + '_1024x1024'))
                        }).catch(() => {
                            firebase.storage().ref(this.props.username)
                                .child('_' + n + '_1024x1024').getDownloadURL().then(url => callback(url))
                        });
                    } else {
                        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                            callback(url)
                        });
                    }
                }
            );
        } else {
            alert('A file should not be more than 15mb')
        }
    };
    sendPost = (e) => {
        this.setState({ show: false })
        e.preventDefault();
        var Post = {
            ...this.state.form,
            body: this.state.form.body.replace(/\n/g, '<br/>'),
            icon: this.props.profilePicture,
            username: this.props.username,
            uid: this.props.uid,
            date: Date.now()
        }
        let s = [...this.state.tempSrc];
        let media = [];
        if (s.length > 0) {
            const loop = () => {
                this.uploadTask(s[media.length].file, (url) => {
                    media.push({
                        src: url,
                        type: s[media.length].type
                    });
                    if (media.length >= s.length) {
                        Post.media = media;
                        firebase.database().ref('posts').push(Post).then(() => {
                            play('success')
                        })
                    } else {
                        loop()
                    }
                }, s[media.length].type)
            }
            loop()
        } else if (Post.body) {
            firebase.database().ref('posts').push(Post).then(() => {
                play('success')
            })
        } else {
            this.setState({ toast: 'Write something or add a media file' });
        }
    }
    render() {
        return <div className="wrapper bg-white p-2 shadow-sm mb-2">
            {this.state.toast && <Toast>{this.state.toast}</Toast>}
            {this.state.show && <Form
                tempSrc={this.state.tempSrc}
                addMedia={this.addMedia}
                sendPost={this.sendPost}
                onChange={this.changed}
                {...this.props}
                {...this.state.form}
                close={() => this.setState({ show: false })} />}
            <div className="d-flex pb-2">
                <Link href="/[profile]" as={'/' + this.props.username} >
                    <a>
                        <Ppicture size="40px" src={this.props.profilePicture} />
                    </a>
                </Link>
                <button onClick={(e) => { e.preventDefault(); this.setState({ show: true }) }} className="input" >Whats on your mind ?</button>
            </div>
            <div className="d-flex justify-content-around">
                <button className="button" onClick={() => {
                    this.setState({ show: true });
                    this.addMedia()
                }} >
                    <i className="fal text-warning fa-image"></i>
                    <i className="fal text-danger fa-video"></i>
                    <span className="text-dark" >Photo / Video</span>
                </button>
            </div>
            <style jsx>{`
                .wrapper {
                    overflow : hidden;
                }
                .input {
                    background : #dddddd55;
                    color : var(--gray-dark);
                    margin : 0;
                    padding :0 10px;
                    transition : all .3s;
                    margin-left : 10px;
                    flex : 1;
                    border-radius : 30px;
                    cursor : pointer;
                }
                .input:hover {
                    background : #dddddd22;
                }
                .button {
                    display : flex;
                    background : none;
                    border-radius : 30px;
                    align-items : center;
                    transition : all .3s;
                    padding : 5px 10px;
                }
                .button i {
                    font-size : 20px;
                    margin-right : 10px;
                }
                .button:hover {
                    background : #aaaaaa55;
                }
                @media only screen and (min-width : 1200px) {
                    .wrapper {
                    border-radius : 5px;
                    }
                }
            `}</style>
        </div>
    }
}

const Form = props => <Modal cancel={props.close} >
    <div className="wrapper animated fadeInUp  shadow">
        <button onClick={props.close} className="p-2 cancel rounded-circle">
            <i className="fal fa-2x fa-times "></i>
        </button>
        <div className="p-2" >

            <div className="border-bottom py-2">
                <h4 className="text-center" >Create A Post</h4>
            </div>
            <div className="d-flex align-items-center mt-2">
                <Ppicture src={props.profilePicture} size='50px' />
                <h6 className="ml-2 mb-0 text-capitalize">{props.username}</h6>
            </div>
            <textarea value={props.body} onChange={e => props.onChange(e, 'body')} className="textarea" placeholder="Whats on your mind ?" />
            <Images freeze sources={props.tempSrc} />
        </div>
        <footer className="p-2" >
            <div className="d-flex justify-content-around border mb-2 p-2 align-items-center">
                <strong style={{ color: 'var(--gray-dark)' }} >Add to your post </strong>
                <div className="d-flex">
                    <button className="button" onClick={props.addMedia} >
                        <i className="fal text-warning fa-photo-video"></i>
                        <span className="text-dark">Photo / Video</span>
                    </button>

                </div>
            </div>
            <button className="btn  btn-fav btn-block" onClick={props.sendPost} >
                <i className="fa mr-3 fa-hourglass" ></i>
                <span>Post</span>
            </button>
        </footer>
    </div>
    <style jsx>{`
       .wrapper {
           border-radius : 10px;
           width : 100vw;
           max-width : 35rem;
           height : 100vh;
           overflow : auto;
           display : flex;
           flex-direction : column;
           justify-content: space-between;
           background : var(--white);
           position : relative;
       }
        .textarea {
           min-height : 40vh;
           width : 100%;
           border-radius : 13px;
           flex : 1;
           margin-top : 8px;
           padding : 10px;
           background : var(--white);
           color : var(--black);
           font-size : 20px;
           transition : all .3s;
        }
        .textarea:focus {
            border : 2px solid #66aaff55;
            font-weight : bold;
       }

       footer {
           position : sticky;
           bottom : 0;
           z-index : 600;
           background : var(--light);
       }
                 .button {
                    display : flex;
                    background : var(--gray);
                    border-radius : 30px;
                    align-items : center;
                    transition : all .3s;
                    padding : 5px 10px;
                }
                .button i {
                    font-size : 20px;
                    margin-right : 10px;
                }
                .button:hover {
                    background : #aaaaaa55;
                }
                .cancel {
                    height : 40px;
                    width : 40px;
                    position : absolute;
                    left : 10px;
                    top : 10px;
                    display : flex;
                    align-items : center;
                    justify-content : center;
                }
                .cancel:hover {
                    background : #ddd;
                }
                @media only screen and (min-width : 760px) {
                    .wrapper {
                        height : unset;
                        max-height : calc(100vh - 6rem);
                        top : 5rem;
                        left : calc(50% - 17.5rem)
                    }
                }
    `}</style>
</Modal>