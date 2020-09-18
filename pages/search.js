import React from 'react';
import Layout from '../components/layouts/profile';
import Post from '../components/posts/post';
import firebase from '../firebase';
import 'firebase/database';
import Router from 'next/router'
import ProfilePicture from '../components/UI/profilePicture';
import UserList from '../components/UI/userList';

export default class Feed extends React.Component {
    state = {
        people: [],
        posts: [],
        userData: {},
        search: ''
    }
    static async getInitialProps({ query }) {
        return { query, key: Date.now() }
    }
    componentDidMount() {
        const ud = JSON.parse(localStorage.getItem('skychatUserData'))
        if (ud) this.setState({ userData: ud });
        if (this.props.query.q) {
            this.getPeople(this.props.query.q.toLowerCase());
            this.getPosts(this.props.query.q.toLowerCase());
            this.setState({ search: this.props.query.q })
        }
    }
    getPeople = (q) => {
        firebase.database().ref('users/').once('value', s => {
            const res = [];
            for (let key in s.val()) {
                const ud = [s.val()[key].username, s.val()[key].fullName.toLowerCase()];
                console.log(ud);
                ud.forEach(cur => {
                    if (cur.indexOf(q) > -1) {
                        res.push({
                            ...s.val()[key],
                            key
                        })
                    }
                });
            }
            this.setState({ loading: false, people: res })
            console.log(res);

        })
    }
    getPosts = (q) => {
        console.log(q);
        firebase.database().ref('posts/').once('value', s => {
            const res = [];
            for (let key in s.val()) {
                const ud = [s.val()[key].body.toLowerCase(), s.val()[key].username.toLowerCase()];
                console.log(ud);
                ud.forEach(cur => {
                    if (cur.indexOf(q.toLowerCase()) > -1) {
                        res.push({
                            ...s.val()[key],
                            id: key
                        })
                    }
                });
            }
            this.setState({ loading: false, posts: res.reverse() })
            console.log(res);

        })
    }

    render() {

        return <Layout title="Feed | Skychat" search={this.props.query.q} >

            <div className="row pt-2 no-gutters" >
                <div className="col-lg-5 pr-lg-3" >
                    <div className="con" >
                        <h4>People</h4>
                        {this.state.people.map(cur => <UserList {...cur} />)}
                    </div>
                </div>
                <div className="col-lg-7 pl-lg-3" >
                    <div className="con" >
                        <h4>Posts  <small> {this.state.posts.length} </small> </h4>
                        {this.state.posts.map(cur => <Post key={cur.id} {...cur} likeeId={this.state.userData.uid} />)}
                    </div>
                </div>
            </div>
            <style jsx>{`
                .con {
                    background :var(--white);
                    margin-bottom : 10px;
                    padding : 10px;
                }
                .con h4 {
                    padding : 10px 15px;
                }
            `}</style>
        </Layout>
    }
}