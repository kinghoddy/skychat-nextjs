import React, { Component } from 'react'
import UserList from '../UI/userList'
import firebase from '../../firebase';
import 'firebase/database';
import Spinner from '../UI/Spinner/Spinner';

export default class Suggestions extends Component {
    state = {
        sug: [],
        count: 4,
    }
    componentDidMount() {
        this.getSug(4)
    }
    getSug = (c) => {
        this.setState({ loading: true });
        firebase.database().ref('users/').orderByChild('username').limitToLast(c).once('value', s => {
            let sug = [];
            console.log(s.val(), this.state.start);
            for (let key in s.val()) {
                sug.push({ ...s.val()[key], key, })
            }
            this.setState({ sug: sug.reverse(), count: c, loading: false });
        });
    }
    loadMore = () => {
        let c = this.state.count
        c += 5;
        this.getSug(c)

    }
    render() {
        return (
            <div className="con" >
                <h6 className="border-bottom p-3" >
                    <i className="fal fa-user-friends mr-2" />
                     Suggestions For you
                </h6>
                {this.state.sug.map(cur => <UserList small {...cur} />)}
                {this.state.loading && <div style={{ height: '8rem ' }} > <Spinner fontSize='3px' /> </div>}

                <button className="btn btn-block rounded-pill btn-light mt-3" onClick={this.loadMore} >Load More</button>
                <style jsx>{`
                   .con {
                  padding : 20px;
              }
            `}</style>
            </div>
        )
    }
}
