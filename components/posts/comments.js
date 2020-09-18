import React, { Component } from 'react'
import Comment from '../forms/comment'
import firebase from '../../firebase';
import 'firebase/database';
import play from '../Audio/Audio';
import Com from './com';
import Spinner from '../UI/Spinner/Spinner';

export default class Comments extends Component {
    state = {
        count: 2,
        userData: {},
        comments: [],
        loading: true
    }
    componentDidMount() {
        const ud = JSON.parse(localStorage.getItem('skychatUserData'))
        if (ud) {

            this.setState({ userData: ud });
            this.getComments(2, ud.uid);
        }
    }
    componentWillUnmount() {
        firebase.database().ref('posts/' + this.props.id + '/comments').off()
    }
    getComments = (count, id) => {
        this.setState({ loading: true })
        const ref = firebase.database().ref('posts/' + this.props.id + '/comments');
        ref.limitToLast(count).on('value', s => {
            let c = [];
            for (let key in s.val()) {
                let d = {
                    ...s.val()[key],
                    key
                }
                if (d.userData.uid === id) d.isMine = true
                c.push(d)
            }
            this.setState({ loading: false, comments: c, count: count })
        });
    };
    delete = (e, id) => {
        e.preventDefault();
        const ref = firebase.database().ref('posts/' + this.props.id + '/comments');
        if (id) {
            ref.child(id).remove().then(() => {
                play('delete')
            })
        }
    }
    sendComment = (e, text) => {
        const com = {
            date: Date.now(),
            userData: { ...this.state.userData },
            comment: text
        }
        firebase.database().ref('posts/' + this.props.id + '/comments').push(com).then(() => {
            play('success')
        })
    }
    loadMore = () => {
        let count = this.state.count;
        if (count < this.props.commentsLength) {
            count += 3;
            this.getComments(count, this.state.userData.uid)
        }

    }
    render() {
        return (
            <div className="con" >
                <div className="top" />
                {this.state.count < this.props.commentsLength && <div className="d-flex justify-content-center pt-2" >
                    <button onClick={this.loadMore} className="rounded-pill btn btn-light btn-sm px-3">
                        See previous comments
                </button>
                </div>}
                {this.state.loading && <div style={{ height: '3rem' }} >
                    <Spinner fontSize="2px" />
                </div>}
                <div className="comments" >
                    {this.state.comments.map(cur => <Com delete={(e) => this.delete(e, cur.key)} key={cur.key} {...cur} />)}
                </div>
                <Comment focus={this.props.focus} submit={this.sendComment} />
                <style jsx>{`
                .top {
                    background : #7775;
                    width : calc(100% - 30px);
                    margin : 0 auto;
                    height : 1px;
                    margin-top : 5px
                    
                }
                   .comments {
                       margin-top : 10px;
                       padding : 0 15px;
                   }
                `}</style>
            </div>
        )
    }
}
