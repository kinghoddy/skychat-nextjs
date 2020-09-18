import React from 'react';
import Layout from '../../components/layouts/profile';
import Post from '../../components/posts/post';
import firebase from '../../firebase';
import 'firebase/database';
import Requests from '../../components/ffriends/requests';
import Spinner from '../../components/UI/Spinner/Spinner';

export async function getServerSideProps({ query }) {
    const res = await firebase.database().ref('posts/' + query.pid).once('value');
    const post = await res.toJSON();
    return { props: { query, post } }

}

export default class Feed extends React.Component {
    state = {
        userData: {
            username: '',
            uid: ''
        },
        post: {},
        loading: true
    }

    componentDidMount() {
        const ud = JSON.parse(localStorage.getItem('skychatUserData'))
        if (ud) this.setState({ userData: ud, loading: false });
        else {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    let udata = JSON.parse(localStorage.getItem('skychatUserData'))

                    if (udata) this.setState({ userData: udata, loading: true });
                }
            });
        }
    }

    render() {

        return <Layout title={this.props.post.username + " added a new post| Skychat"} body={this.props.post.body}>
            <div className="row py-2 py-lg-3 no-gutters">
                <div className="col-lg-7 pr-lg-1">
                    {this.state.loading ? <div id="watch" style={{ height: '5rem' }} >
                        <Spinner fontSize="3px" />
                    </div> : <Post {...this.props.post} id={this.props.query.pid} likeeId={this.state.userData.uid} />}

                </div>
                <div className="col-lg-5 pl-lg-1 position-relative">
                    <div className="side">

                    </div>
                </div>
            </div>
            <style jsx>{`
               .side {
                   position : sticky;
                   top : 4rem;
               }
        
            `}</style>
        </Layout>
    }
}