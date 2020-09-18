import React, { Component } from 'react'
import UserList from '../UI/userList'
import firebase from '../../firebase';
import 'firebase/database';

export default class Suggestions extends Component {
    state = {
        sug: [],
        count: 3
    }
    componentDidMount() {
        this.getSug(3)
    }
    getSug = (c) => {
        firebase.database().ref('users').limitToLast(c).once('value', s => {
            let sug = [];
            for (let keys in s.val()) {
                sug.push({ ...s.val()[keys] })
            }
            this.setState({ sug: sug.reverse(), count: c });
        })
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
                <button className="btn btn-block rounded-pill btn-light mt-3" onClick={this.loadMore} >Load More</button>
                <style jsx>{`
                   .con {
                  padding : 20px;
            box-shadow: 0 0px 3px 2px #0001;
            background : var(--white);
              }
            `}</style>
            </div>
        )
    }
}
