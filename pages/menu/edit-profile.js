import React from 'react';
import Layout from '../../components/layouts/profile';
import firebase from '../../firebase';
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'
import MenuList from '../../components/menu/menuList';
import ProfilePicture from '../../components/UI/profilePicture';
import Input from '../../components/UI/input';
import Toast from '../../components/UI/Toast/Toast'
class Menu extends React.Component {
    state = {
        userData: {
            username: '',
            profilePicture: '',
            fullName: '',
            info: {
                bio: '',
                phone: '',
                gender: '',
                email: '',
                address: ''
            },
            coverPhoto: '',
        },
        uid: null,
        toast: null,
        tempSrc: null,
        file: null,
        type: null,
        updated: false,
        progress: 0
    }
    componentDidMount() {
        this.setState({ loading: true })
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                firebase.database().ref('users/' + user.uid).once('value', s => {
                    let uData = { ...this.state.userData }
                    for (let keys in uData) {
                        uData[keys] = s.val()[keys]
                    }
                    uData.uid = user.uid
                    if (!s.val().info) {
                        uData.info = { ...this.state.userData.info }
                    }
                    this.setState({ userData: uData, loading: false, uid: user.uid })
                })
            }
        })
    }
    update = () => {
        this.setState({ toast: null, updated: false })
        const data = { ...this.state.userData };
        firebase.database().ref('users/' + this.state.uid).update(data).then(() => {
            this.setState({ toast: 'Updated Info Successfully' })
        }).catch(() => {
            this.setState({ toast: 'Failed to update profile', updated: true })
        })
    }
    changeInfo = (e, type) => {
        const ud = { ...this.state.userData };
        if (type === 'fullName') {
            ud[type] = e.target.value;
            this.setState({ userData: ud })
        } else {
            ud.info[type] = e.target.value;
            this.setState({ userData: ud })
        }
        this.setState({ updated: true })
    }
    upload = (type, file) => {
        this.setState({ toast: null, showCover: false, showDp: false })
        var uploadTask = firebase
            .storage()
            .ref(type + '/' + this.state.userData.uid)
            .put(file);
        this.props.setUpload(uploadTask, 'Uploading Profile Picture')
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            const progressMsg = "Upload is " + Math.floor(progress) + "% done";
            this.setState({ toast: 'uploading' });
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    break;
            }
        },
            function (error) {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case "storage/unauthorized":
                        // User doesn't have permission to access the object
                        break;

                    case "storage/canceled":
                        // User canceled the upload
                        break;

                    case "storage/unknown":
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                }
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    const ud = { ...this.state.userData };
                    const url = downloadURL.replace(ud.uid, ud.uid + '_1024x1024')
                    ud[type] = url;
                    this.setState({ progress: 0, toast: null, userData: ud });
                    firebase.database().ref('users/' + ud.uid + '/' + type).set(url);
                    if (type === 'profilePicture') firebase.auth().currentUser.updateProfile({
                        photoURL: url
                    });

                });
            }
        );
    }
    changeImg = type => {
        this.setState({ toast: null, changed: null })
        const fileInp = document.createElement('input');
        fileInp.type = 'file';
        fileInp.setAttribute('accept', 'image/*')
        fileInp.click();
        const check = ['png', 'jpg', 'jpeg']
        fileInp.onchange = e => {
            let file = fileInp.files[0];
            let cname = file.name.toLowerCase().split('.')
            if (check.indexOf(cname[cname.length - 1]) < 0) this.setState({ toast: 'File format not supported' });
            else {
                const tempSrc = URL.createObjectURL(file);
                this.setState({ tempSrc, changed: type, file })
                // setTimeout(() => {
                //     URL.revokeObjectURL(tempSrc); // free memory
                // }, 1000);
            }
        }
    }
    render() {
        const ImageV = props => <React.Fragment>
            <div className="backdrop" />
            <div className="con ">
                <nav className="navbar  text-white" >
                    <button onClick={() => this.setState({ [props.set]: false })} className="btn-outline-light rounded-circle btn" >
                        <i className="fa fa-arrow-left" />
                    </button>
                    <h6 className="mx-auto" >Edit
         <i className="fa fa-edit ml-2" />
                    </h6>
                    {this.state.changed && <button onClick={() => this.upload(this.state.changed, this.state.file)} className="btn btn-dark rounded-circle" >
                        <i className="fal fa-check" />
                    </button>}
                </nav>

                <img src={this.state.tempSrc} className="img-fluid bg-white" />
                <div className="d-flex bottom" >

                    <button onClick={() => this.changeImg(props.type)} className="rounded-pill px-3 btn btn-outline-warning" >
                        <i className="fa fa-camera mr-2" />
            Change</button>
                </div>
            </div>
            <style jsx>{`
            .backdrop {
                position : fixed ;
                width : 100vw;
                height : 100vh;
                z-index : 1100;
                top : 0;
                left : 0;
                backdrop-filter : blur(10px) brightness(80%) ;
            }

       .con {
           background : #000;
           display : flex;
           align-items : center;
           position : fixed ;
           z-index : 2000;
           top : 0;
           left : 50%;
           transform : translateX(-50%);
           height : 100vh;
           width : 100vw;
           max-width : 40rem;
       }
       .navbar {
           position : absolute ;
           top : 0 ;
           background : #0006;
           left : 0;
           width : 100%;
       }
       .con img {
           width : 100%
       }
       .bottom {
           position :absolute;
           bottom : 0;
           left :0 ;
           padding : 10px;
           justify-content : space-evenly;
           background : #0005;
           width : 100%;
       }

    `}</style>
        </React.Fragment>

        return <Layout title="Edit profile | Skychat" active="menu" >
            {this.state.toast && <Toast>{this.state.toast}</Toast>}
            {this.state.showCover && <ImageV set='showCover' type='coverPhoto' />}
            {this.state.showDp && <ImageV set="showDp" type="profilePicture" />}
            <div className="row no-gutters py-2 px-3" >
                <div className="col-lg-5 d-none d-lg-block" >
                    <MenuList />
                </div>
                {this.state.loading ? <div className="spinner-border text-danger my-4 mx-auto" /> : <div className="col-lg-7 px-md-2" >
                    <div className="cover" >
                        <img onClick={() => this.setState({ showCover: true, tempSrc: this.state.userData.coverPhoto })} src={this.state.userData.coverPhoto} alt="" className="cursor" />
                        <div className="cursor" onClick={() => this.setState({ tempSrc: this.state.userData.profilePicture, showDp: true })}  >
                            <ProfilePicture size="120px" src={this.state.userData.profilePicture} />
                        </div>
                        <p className="text-center" >{this.state.userData.username}</p>
                    </div>
                    <div className="con" >
                        <h4 className="mb-3">  Edit Info
                         <i className="fal fa-edit ml-3" />
                        </h4>
                        <Input onChange={e => this.changeInfo(e, 'fullName')} label="Full Name" value={this.state.userData.fullName} cap />
                        <Input onChange={e => this.changeInfo(e, 'bio')} label="Bio" type="textarea" value={this.state.userData.info.bio} />
                        <Input onChange={e => this.changeInfo(e, 'email')} label="Email" type="email" value={this.state.userData.info.email} />
                        <Input onChange={e => this.changeInfo(e, 'phone')} label="Phone number" type="number" value={this.state.userData.info.phone} />
                        <Input onChange={e => this.changeInfo(e, 'address')} label="Address" type="textarea" value={this.state.userData.info.address} />
                        {this.state.updated && <button onClick={this.update} className="btn-block btn btn-primary rounded-pill mt-4" >Update Profile</button>}
                    </div>
                </div>

                }   </div>
            <style jsx>{`
            .sticky {
                position : sticky;
                top : 3rem;
                height : 10px;
                z-index : 1500
            }
                .row {
                    background : #e7e7e7;
                    min-height : 100vh;
                }    
                           .cursor {
        cursor : pointer;
    }
               .cover {
                   margin-bottom :7rem;
                   height : 15rem;
               }
               .cover img {
                   height : 100%;
                   border-radius : 10px;
                   width : 100%;
                   background: #fff;
                   object-fit : cover
               }
               .cover > div {
                   margin-top : -3rem;
                   display : flex;
                   justify-content : center;
               }
               .con {
                   background : #f7f7f7;
                   padding : 20px 10px;
               }
               @media only screen and (min-width : 1200px) {
              .sticky {
                  top : 3.4rem
              }
               }
            `}</style>
        </Layout>
    }
}
export default Menu