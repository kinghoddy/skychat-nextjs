import React from 'react';
import Layout from '../../components/layouts/profile';
import Post from '../../components/posts/post';
import firebase from '../../firebase';
import 'firebase/database';
import CoverProfile from '../../components/coverProfile';
import Friends from '../../components/ffriends/friendsGrid'
import Info from '../../components/profileInfo';
import Spinner from '../../components/UI/Spinner/Spinner';
import Requests from '../../components/ffriends/requests';
import Router from 'next/router'

export default class Timeline extends React.Component {
    state = {
        userData: {
            username: ''
        },
        isMine: false,
        profileData: {},
        loadCount: 2,
        posts: [],
        loggedOut: false,
        postsLength: 0
    }

    getPosts = (n) => {
        this.setState({ loading: true })
        firebase.database().ref('posts').orderByChild('uid').equalTo(this.props.d.uid).once('value', s => {
            this.setState({ postsLength: s.numChildren() })
        });
        firebase.database().ref('posts').orderByChild('uid').equalTo(this.props.d.uid).limitToLast(n).once('value', s => {
            const p = []
            for (let key in s.val()) {
                p.push({
                    ...s.val()[key],
                    id: key
                })
            }
            this.setState({ posts: p, loading: false, loadCount: n })
        })
    }
    componentDidMount() {
        const ud = JSON.parse(localStorage.getItem('skychatUserData'))
        if (ud) {
            this.setState({ userData: ud });
            if (this.props.d.uid === ud.uid) {
                this.setState({ isMine: true })
            }
        } else {
            this.setState({ loggedOut: true })
        }
        if (this.props.d.uid) {
            this.getPosts(2);
            window.addEventListener('scroll', this.loadMore, false)
        } else {
            this.setState({ broken: true })
        }
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.loadMore, false)
    }


    loadMore = () => {
        let count = this.state.loadCount;
        count += 5;
        const watch = document.querySelector('.watch').getBoundingClientRect().top
        if (watch <= window.innerHeight) {
            if (this.state.loadCount < this.state.postsLength) {
                this.getPosts(count);
            }
        };
    }
    render() {
        const posts = this.state.posts
        posts.sort((a, b) => {
            return b.date - a.date;
        });
        return <Layout broken={this.state.broken} stay title={(this.props.d.username && this.props.d.username.toUpperCase()) + " | Skychat"} src={this.props.d.profilePicture} >


            <div className="px-lg-1 pt-0 pt-lg-2 cover" >
                <div className='mb-1 ' >
                    <CoverProfile loggedOut={this.state.loggedOut}  {...this.props.d} userData={this.state.userData} isMine={this.state.isMine} />
                </div>
            </div>

            <div className="row  no-gutters">
                <div className="col-md-5  px-md-1 order-lg-2 position-relative">
                    <div className="side" >
                        <div className="mb-2" >
                            <Info {...this.props.d} />
                        </div>
                        <div className="mb-2" >
                            <Friends {...this.props.d} />
                        </div>
                        {this.state.isMine && <div className="mb-2" >
                            <Requests {...this.props.d} />
                        </div>}
                    </div>

                </div>
                {!this.state.loggedOut && <div className="col-md-7 px-md-1 order-lg-1 ">

                    <div className="mb-2" >
                        <h5 className="bg-white mb-0 p-2" >Posts <small> {this.state.postsLength} </small> </h5>
                        {this.state.posts.map(
                            (cur, i) =>
                                <Post key={cur.id} {...cur} likeeId={this.state.userData.uid} />
                        )}
                        <div className="watch">
                            {this.state.loading && <div style={{ height: '4rem' }} > <Spinner fontSize="3px" /></div>}
                        </div>
                    </div>
                </div>
                }

            </div>
            <style jsx>{`
            @media (min-width : 768px) {

                .side {
                    position : sticky;
                    top : 3.5rem;
                }
                .cover {
                    
                }
            }
            `}</style>
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
