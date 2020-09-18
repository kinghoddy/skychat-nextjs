import React from 'react';
import Layout from '../../components/layouts/profile';
import firebase from '../../firebase';
import 'firebase/database';
import Spinner from '../../components/UI/Spinner/Spinner';
import UserCard from '../../components/UI/userCard'
import CoverProfileLess from '../../components/actionlessCover';

export default class AllFriends extends React.Component {
    state = {
        userData: {
            username: ''
        },
        friendsData: [],
        isMine: false,
        profileData: {},
        count: 9,
        friendsLength: 0
    }
    componentDidMount() {
        this.getFriends(this.props.d.uid, 9);
        window.addEventListener('scroll', this.loadMore, false)
    }
    loadMore = () => {
        let count = this.state.count;
        count += 6;
        const watch = document.querySelector('.watch').getBoundingClientRect().top
        if (watch <= window.innerHeight) {
            if (this.state.count < this.state.friendsLength) {
                this.getFriends(this.props.d.uid, count);
            }
        };
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.loadMore, false)
    }
    getFriends(uid, count) {
        if (uid) {
            this.setState({ loading: true })
            var ref = firebase.database().ref('users/' + uid + '/friendsId')
            let l = 0;
            ref.on('value', s => {
                l = s.numChildren()
                this.setState({ friendsLength: l })
            })
            ref.limitToLast(count).once('value', s => {
                if (s.val()) {
                    let arr = [];
                    const friendsData = []
                    for (let keys in s.val()) arr.push(s.val()[keys]);
                    arr = arr.reverse()
                    arr.forEach((cur, i) => {
                        firebase.database().ref('users/' + cur)
                            .once('value', snap => {
                                if (snap.val() && snap.val().username) {
                                    const friend = {
                                        username: snap.val().username,
                                        fullName: snap.val().fullName,
                                        info: snap.val().info,
                                        src: snap.val().profilePicture,
                                        uid: cur,
                                        online: snap.val().connections
                                    }
                                    friendsData.push(friend)
                                    if (friendsData.length - 1 >= i) setTimeout(() => {
                                        this.setState({ count: count, friendsData: friendsData, loading: false })
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
        return <Layout broken={this.state.broken} stay title={(this.props.d.username && 'Friends Of' + this.props.d.username.toUpperCase()) + " | Skychat"} src={this.props.d.profilePicture}>
            <CoverProfileLess {...this.props.d} />
            <div className="p-4 d-flex justify-content-between" >
                <h5 className="mb-0" > <i className="fa fa-user-friends" /> All Friends</h5>
                <span>{this.state.friendsLength}</span>
            </div>
            <div className="row no-gutters" >


                {this.state.friendsData.map((cur, i) => <div key={cur.uid} className="px-1 py-2 col-12 col-lg-4" >
                    <UserCard {...cur} full />
                </div>)}

            </div>
            <div style={{ height: '5rem' }} className="watch">
                {this.state.loading && <Spinner fontSize="3px" />}
            </div>
        </Layout>
    }
}
export async function getServerSideProps({ query }) {
    // Fetch data from external API
    const res = await firebase.database().ref('users/').orderByChild('username').equalTo(query.profile.trim()).once('value')

    const data = await res.toJSON()
    let d = {}
    for (let key in data) {
        d = { ...data[key], uid: key }
    }
    // Pass data to the page via props
    return { props: { query, key: Date.now(), d } }
}