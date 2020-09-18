import React from 'react';
import 'firebase/database'
import firebase from '../../firebase';
import RequestUser from './requestUser'
import Spinner from '../UI/Spinner/Spinner'
class Requests extends React.Component {
    state = {
        req: [],
        reqLength: 0
    }
    componentDidMount() {
        this.getReqs(this.props.uid)
    }
    componentDidUpdate() {
        if (this.state.uid !== this.props.uid) {
            this.setState({ uid: this.props.uid })
            this.getReqs(this.props.uid)
        }
    }
    confirmRequest = (user) => {
        let chatId = null;
        if (user.uid > this.props.uid) {
            chatId = user.uid + '&' + this.props.uid;
        } else {
            chatId = this.props.uid + '&' + user.uid;
        }
        // define Refs
        const db = firebase.database();
        const ref = db.ref("users/" + user.uid);
        const myRef = db.ref("users/" + this.props.uid);
        const chatsRef = db.ref("chats/" + chatId);
        // Clearing Requests;
        ref.child('requestsId/' + this.props.uid).remove();
        myRef.child('requestsId/' + user.uid).remove();


        //  Set friends and Chats IDs
        ref.child("friendsId").push(this.props.uid);
        ref.child("chats").push(chatId);
        myRef.child("friendsId").push(user.uid);
        myRef.child("chats").push(chatId);

        // Setup Chatting

        chatsRef.set({
            metadata: {
                [this.props.uid]: {
                    profilePicture: this.props.profilePicture,
                    username: this.props.username
                },
                [user.uid]: {
                    profilePicture: user.profilePicture,
                    username: user.username
                }
            }
        })
        chatsRef.child('chats').push({
            message:
                "You are now connected together. Enjoy chatting in the cloud ",
            sender: "skychat",
            date: Date.now()
        })

        //  sending not
        let n = {
            title: this.props.username + ' Accepted Your Friend Request',
            icon: this.props.profilePicture,
            link: '/[profile]?profile=' + this.props.username,
            date: Date.now()
        }
        ref.child('notifications').push(n)
    }
    getReqs(uid) {
        if (uid) {
            this.setState({ loading: true })
            var ref = firebase.database().ref('users/' + uid + '/requestsId')
            let l = 0;

            ref.on('value', s => {
                l = s.numChildren()
                this.setState({ reqLength: l })
                if (s.val()) {
                    let arr = [];
                    const requests = []
                    for (let keys in s.val()) arr.push(keys);
                    arr = arr.reverse()
                    arr.forEach((cur, i) => {
                        firebase.database().ref('users/' + cur)
                            .once('value', snap => {
                                if (snap.val() && snap.val().username) {
                                    const friend = {
                                        username: snap.val().username,
                                        src: snap.val().profilePicture,
                                        uid: cur,
                                        online: snap.val().connections
                                    }
                                    requests.push(friend)
                                    if (requests.length - 1 === i) setTimeout(() => {
                                        this.setState({ req: requests, loading: false })
                                    }, 1000)
                                }
                            })
                    })


                } else {
                    this.setState({ req: [], loading: false })
                }
            })
        }
    }
    render() {
        return this.state.req.length > 0 ? <div className="con" >
            <div className="d-flex justify-content-between" >
                <h5  >
                    <i className="fad fa-user-plus mr-2 text-danger" />
                    Friend Requests</h5>
                <span>{this.state.reqLength}</span>
            </div>
            {this.state.loading ? <div style={{ height: '13rem' }} >
                <Spinner fontSize="5px" />
            </div> : <div className=" pt-2 " >
                    {this.state.req.map((cur, i) => <div key={cur.username} className="mb-3" >
                        <RequestUser  {...cur} confirmRequest={this.confirmRequest} />
                    </div>)}
                    {this.state.reqLength > 4 && <div className="pt-3" >
                        <button className="btn btn-outline-dark btn-block btn-sm" >See All</button>
                    </div>}
                </div>}

            {this.state.reqLength === 0 && !this.state.loading && <div className="text-center" >
                <h6>No Friend Requests</h6>
            </div>}
            <style jsx>{`
                   .con {
                  padding : 20px;
            box-shadow: 0 0px 3px 2px #0001;
            background : var(--white);
              }
            `}</style>
        </div> : null
    }
}

export default Requests