import React from 'react';
import Layout from '../components/layouts/profile';
import firebase from '../firebase';
import 'firebase/database';
import ProfilePicture from '../components/UI/profilePicture';
import SwipableTab from '../components/UI/swipable-tab';
import SearchAll from '../components/search/SearchAll';
import MenuList from '../components/menu/menuList'
export async function getServerSideProps({ query }) {
    return { props: { query, key: query.q } }
}

export default class Search extends React.Component {
    state = {
        people: [],
        posts: [],
        userData: {},
        search: ''
    }

    componentDidMount() {
        const ud = JSON.parse(localStorage.getItem('skychatUserData'))
        if (ud) this.setState({ userData: ud });
        if (this.props.query.q) {
            const query = this.props.query.q.toLowerCase()
            this.searchUser(query)
            this.getPosts(query);
            this.setState({ search: this.props.query.q })

        }
    }

    getPeople = (q) => {
        firebase.database().ref('users/').once('value', s => {
            const res = [];
            for (let key in s.val()) {
                let ud = s.val()[key].username + s.val()[key].fullName;
                ud = ud.toLowerCase()
                if (ud.indexOf(q) > -1) {
                    res.push({
                        ...s.val()[key],
                        key
                    })
                }
            }
            this.setState({ loading: false, people: res })
            console.log(res);

        })
    }
    getPosts = (query) => {
        this.setState({ posts: "loading" })
        firebase.database().ref('posts/').orderByChild('username').startAt(query).endAt(query + "\uf8ff").once('value', s => {
            const res = [];
            for (let key in s.val()) {
                res.push({
                    ...s.val()[key],
                    id: key
                })
            }
            this.setState({ posts: res.reverse() })

        })
    }

    searchUser = async (query) => {
        this.setState({ loading: true })
        let resObj = await (await firebase.database().ref('users').orderByChild('username').startAt(query).endAt(query + "\uf8ff").once('value')).val();
        let resObj2 = await (await firebase.database().ref('users').orderByChild('fullName').startAt(query).endAt(query + "\uf8ff").once('value')).val();
        const res = { ...resObj, ...resObj2 }
        console.log(resObj2);
        let resArr = []
        for (let key in res) {
            const u = {
                ...res[key],
                key
            }
            resArr.push(u)
        }
        this.setState({ loading: false, people: resArr })



    }
    render() {

        return <Layout full title="Search | Skychat" search={this.props.query.q} notProps={this.props.notProps}>
            <div className="row" >
                <div className="col-lg-3 d-none d-lg-block" >
                    <MenuList />
                </div>
                <div className="col-lg-6 mx-auto " >
                    <SwipableTab
                        tabNav={[
                            {
                                id: 'search_all',
                                text: "All"
                            },
                            {
                                id: "search_people",
                                text: <React.Fragment>
                                    <i className="fal fa-users mr-2" />People
                        </React.Fragment>
                            },
                            {
                                id: "search_post",
                                text: <React.Fragment>
                                    <i className="fal fa-scroll mr-2" />Posts
                        </React.Fragment>
                            },
                        ]}
                        tabContent={[{
                            id: 'search_all',
                            component: <SearchAll
                                key={this.props.query.q}
                                people={this.state.people}
                                loading={this.state.loading}
                                posts={this.state.posts}
                                userData={this.state.userData}
                                query={this.state.search.toLowerCase()} />
                        }]}
                    />
                </div>
            </div>



        </Layout>
    }
}