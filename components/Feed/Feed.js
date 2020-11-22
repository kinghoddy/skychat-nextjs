import React from 'react';
import Layout from '../layouts/profile';
import AddPost from '../forms/addPost';
import Post from '../posts/post';
import firebase from '../../firebase';
import 'firebase/database';
import Requests from '../ffriends/requests';
import Spinner from '../UI/Spinner/Spinner';
import Menu from '../menu/menuList'
import Suggestions from '../ffriends/suggestions';
import MayKnow from '../ffriends/may-know';
import MenuList from '../menu/menuList';

export default class Feed extends React.Component {
    state = {
        userData: {
            username: '',
            uid: ''
        },
        loadCount: 5,
        posts: [],
        offset: 40,
        down: true
    }
    componentDidUpdate() {
        if (this.state.userData.uid && !this.state.fired) {
            this.setState({ fired: true });
            this.getPosts();
        }

    }

    componentDidMount() {
        const ud = JSON.parse(localStorage.getItem('skychatUserData'))

        if (ud) this.setState({ userData: ud });
        else {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    let udata = {
                        profilePicture: user.photoURL,
                        username: user.displayName,
                        uid: user.uid
                    }

                    if (udata) this.setState({ userData: udata });
                }
            })
        }
        const initPosts = localStorage.getItem("skychatFeed");
        if (initPosts) {
            this.setState({ posts: JSON.parse(initPosts) });
        }
        window.addEventListener('scroll', this.loadMore, false);

    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.loadMore, false)
    }
    upDateFeed = (friendsArr) => {
        const feeds = firebase.database().ref('posts')
        feeds.limitToLast(1).on('child_added', s => {
            if (friendsArr.indexOf(s.val().uid) > -1) {
                this.setState({ update: true })
            }
        })
    }
    getPosts = () => {
        this.setState({ loading: true });
        const ref = firebase.database().ref("users/");
        ref.child(this.state.userData.uid + '/friendsId').on("value", (s) => {
            let friendsId = s.val();
            let friendsArr = [this.state.userData.uid];
            for (let key in friendsId) {
                friendsArr.push(friendsId[key]);
            }
            this.upDateFeed(friendsArr)
            const feedRef = firebase.database().ref("posts/");
            let Posts = [];
            friendsArr.forEach((cur, i) => {
                feedRef
                    .orderByChild("uid")
                    .equalTo(cur)
                    .limitToLast(100)
                    .once("value", (s) => {
                        for (let key in s.val()) {
                            let post = {
                                ...s.val()[key],
                                id: key,
                            };
                            Posts.push(post);
                            localStorage.setItem(
                                "skychatFeed",
                                JSON.stringify(Posts.reverse())
                            );
                        }
                        if (friendsArr.length - 1 === i) {
                            setTimeout(() => {
                                console.log(Posts);
                                this.setState({ posts: Posts.reverse(), update: false, loading: false });
                            }, 1000);
                        }
                    });
            });
        });
    };
    loadMore = () => {
        document.activeElement.blur();
        let count = this.state.loadCount;
        count += 5;
        const watch = document.getElementById("watch").getBoundingClientRect().top;
        if (window.scrollY >= watch) {
            if (this.state.loadCount < this.state.posts.length) {
                setTimeout(() => {
                    this.setState({ loadCount: count });
                }, 500)
            }
        }
    };
    render() {
        const posts = [...this.state.posts]
        posts.sort((a, b) => {
            return b.date - a.date;
        });
        return <Layout full title="Feed | Skychat" notProps={this.props.notProps} >
            <div className="row py-2 py-lg-3 no-gutters">
                <div className="col-lg-3 d-none d-lg-block" >
                    <MenuList transparent />
                </div>
                <div className="col-lg-5 mx-auto">
                    {!this.state.loading && this.state.update && <button className="btn rounded-pill update" onClick={() => {
                        this.getPosts();
                        document.documentElement.scrollTop = 0;
                    }} >
                        <i className="fal fa-arrow-up mr--2" /> Feed Updated
                    </button>}
                    <AddPost setUpload={this.props.setUpload} {...this.state.userData} />

                    <div className="mb-2" >
                        <Requests {...this.state.userData} />
                    </div>
                    {posts.map(
                        (cur, i) =>
                            i < 2 && (
                                <Post key={cur.id} {...cur} likeeId={this.state.userData.uid} />
                            )
                    )}
                    <div className="mb-3">
                        <MayKnow />
                    </div>
                    {posts.map(
                        (cur, i) =>
                            i > 1 && (
                                <Post key={cur.id} {...cur} likeeId={this.state.userData.uid} />
                            )
                    )}
                    <div id="watch" style={{ height: '5rem' }}>

                        {this.state.loading && <Spinner fontSize="3px" />}
                    </div>
                </div>
                <div className="col-lg-3 d-none  d-lg-block position-relative">
                    <div className="side">
                        <div className="mb-2" >

                            <Suggestions />
                        </div>

                    </div>
                </div>
            </div>
            <style jsx>{`
               .side {
                   position : sticky;
                   top : 4rem;
                   height : calc(100vh - 4rem);
                   overflow : auto;
               }
               .update {
                   position : fixed ;
                   z-index : 1000;
                   top : 4rem ;
                   left : 50%;
                   font-size : 12px;
                   transform : translateX(-50%);
                   background : var(--white);
                   box-shadow : 0 3px 10px #0004;
               }
            `}</style>
        </Layout>
    }
}