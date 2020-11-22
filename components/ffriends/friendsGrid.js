import React from 'react';
import firebase from '../../firebase';
import 'firebase/database';
import UserCard from '../UI/userCard'
import Spinner from '../UI/Spinner/Spinner';
import Link from 'next/link'

class Friends extends React.Component {
    state = {
        friendsData: [],
        friendsLength: 0
    }
    componentDidMount() {
        this.getFriends(this.props.uid)

    }
    componentDidUpdate() {
        if (this.state.uid !== this.props.uid) {
            this.setState({ uid: this.props.uid })
            this.getFriends(this.props.uid)
        }
    }
    getFriends(uid) {
        if (uid) {
            this.setState({ loading: true })
            var ref = firebase.database().ref('users/' + uid + '/friendsId')
            let l = 0;
            ref.on('value', s => {
                l = s.numChildren()
                this.setState({ friendsLength: l });
                const f = { ...s.val() };
                if (Object.fromEntries) {
                    let o = Object.entries(f).sort((a, b) => {
                        return b[1].localeCompare((a[1]))
                    })
                        .filter((cur, i, arr) => {
                            return !i || cur[1] !== arr[i - 1][1]; // some irrelevant conditions here
                        })
                    let q = Object.fromEntries(o);
                    firebase.database().ref(ref).set(q)
                    // console.log(f, o);
                }

            })
            ref.limitToLast(5).on('value', s => {
                if (s.val()) {
                    let arr = Object.values(s.val());
                    const friendsData = [];
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
                                    friendsData.push(friend)
                                    if (friendsData.length - 1 >= i) setTimeout(() => {
                                        this.setState({ friendsData: friendsData, loading: false })
                                    }, 1000)
                                }
                            })
                    })


                } else {
                    this.setState({ friendsData: [], loading: false })
                }
            })
        }
    }
    render() {
        return <div className="con" >
            <div className="d-flex justify-content-between" >
                <h5  >
                    <i className="fad fa-user-friends mr-2 text-warning" />
                    Friends</h5>
                <span>{this.state.friendsLength}</span>
            </div>
            {this.state.loading ? <div style={{ height: '13rem' }} >
                <Spinner fontSize="5px" />
            </div> : <div className="row no-gutters " >
                    {this.state.friendsData.map((cur, i) => <div key={cur.uid} className="px-1 py-2 col-4" >
                        <UserCard {...cur} />
                    </div>)}
                    {this.state.friendsLength > 0 && <div className="px-1 py-2 col-4" >
                        <div className="more">
                            <i className="fad fa-users" />
                            <Link href={"/" + this.props.username + '/friends'}>

                                <a className="btn  mt-3 btn-dark rounded-pill" >See All</a>
                            </Link>
                        </div>
                    </div>}
                </div>}
            {this.state.friendsLength === 0 && !this.state.loading && <div className="text-center" >
                <h6>No Friends</h6>
            </div>}
            <style jsx>{`
              .con {
                  padding : 20px;
            box-shadow: 0 0px 3px 2px #0001;
            background : var(--white);
              }
              .more {
                  display : flex;
                  flex-direction : column;
                  background : #eee;
                  height : 100%;
                  align-items : center;
                  justify-content : center;
              }
              .more i {
                  font-size : 50px;
                  color : #f21;
                  border-radius: 10px;
              }
              .more .btn {
                  font-size : 10px !important;
                  padding : 3px 13px;
              }
              
            `}</style>
        </div>
    }
}
export default Friends