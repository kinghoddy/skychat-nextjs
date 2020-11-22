import React, { Component } from 'react'
import Comment from '../forms/comment'
import firebase from '../../firebase';
import 'firebase/database';
import play from '../Audio/Audio';
import Com from './com';
import Spinner from '../UI/Spinner/Spinner';

export default class Comments extends Component {
    state = {
        count: this.props.fullDisplay ? 8 : 2,
        userData: {},
        comments: [],
        loading: true
    }
    componentDidMount() {
        const ud = JSON.parse(localStorage.getItem('skychatUserData'))
        if (ud) {
            this.setState({ userData: ud });
            this.getComments(this.state.count, ud.uid);
        }
    }

    getComments = (count, id) => {
        this.setState({ loading: true })
        const ref = firebase.database().ref('posts/' + this.props.id + '/comments');
        ref.limitToLast(count).on('value', s => {
            let c = [];
            for (let key in s.val()) {
                let d = {
                    likes: {},
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
        console.log(this.props);
        const com = {
            date: Date.now(),
            userData: { ...this.state.userData },
            comment: text
        }
        let n = {
            title: '<b>' + com.userData.username + '</b> commented <small>' + text.substring(0, 20) + '</small>... on your post. ' + '<strong>' + this.props.post.body.substring(0, 40) + '</strong>..',
            icon: this.props.post.media[0] && this.props.post.media[0].src || com.userData.profilePicture,
            link: '/post/' + this.props.id,
            date: Date.now()
        }
        firebase.database().ref('posts/' + this.props.id + '/comments').push(com).then(() => {
            play('success');
            if (!this.props.isMine) firebase.database().ref('users/' + this.props.uid + '/notification').push(n)

        })
    }
    like = (e, cur) => {
        e.preventDefault();
        firebase.database().ref('posts/' + this.props.id + '/comments/' + cur.key + '/likes/' + this.state.userData.username).set(Date.now());
    };
    reply = (e, text, cur) => {
        const ref = firebase.database().ref('posts/' + this.props.id + '/comments/' + cur.key + '/replies');
        const com = {
            date: Date.now(),
            userData: { ...this.state.userData },
            comment: text
        }
        let n = {
            title: '<b>' + com.userData.username + '</b> replied ' + cur.userData.username + ' on your post. ' + '<strong>' + this.props.post.body.substring(0, 40) + '</strong>..',
            icon: this.props.post.media[0] && this.props.post.media[0].src || com.userData.profilePicture,
            link: '/post/' + this.props.id,
            date: Date.now()
        }

        ref.push(com).then(() => {
            play('sent');
            if (!this.props.isMine) firebase.database().ref('users/' + this.props.uid + '/notification').push(n)
            n.title = com.userData.username + ' replied your comment <small>' + cur.comment + '</small>';
            firebase.database().ref('users/' + cur.userData.uid + '/notification').push(n);
        })
    }
    loadMore = () => {

        let count = this.state.count;
        if (count < this.props.commentsLength) {
            count += 3;
            document.activeElement.blur();
            this.getComments(count, this.state.userData.uid)
        }

    }
    render() {
        return (
            <div className="con" >
                {!this.props.fullDisplay && <div className="top" />}
                {this.state.count < this.props.commentsLength && <div className="d-flex justify-content-center pt-2" >
                    <button onClick={this.loadMore} className="rounded-pill btn btn-light btn-sm px-3">
                        See previous comments
                </button>
                </div>}

                <div className="comments" >
                    {this.state.loading ? <div className="text-center" style={{ height: '3rem' }} >
                        {/* <Spinner fontSize="3px" /> */}
                        <div className="spinner-border" style={{ color: 'var(--red' }} />
                    </div> : this.state.comments.length == 0 && <div className="noCom" >
                        <i className="fad fa-comment-exclamation text-danger" />
                        <i className="fad fa-comment-smile text-warning" />

                        <h3>No comments yet</h3>
                        <p>Be the first to comment on this post</p>
                    </div>}
                    {this.state.comments.map(cur => <Com
                        reply={(e, text) => this.reply(e, text, cur)}
                        like={(e) => this.like(e, cur)}
                        delete={(e) => this.delete(e, cur.key)}
                        key={cur.key}
                        {...cur} />)}
                </div>
                <div className="com" >

                    <Comment focus={this.props.focus} submit={this.sendComment} />
                </div>
                <style jsx>{`
                .top {
                    background : #7775;
                    width : calc(100% - 30px);
                    margin : 0 auto;
                    height : 1px;
                    margin-top : 5px
                    
                }
                .noCom {
                    text-align : center;
                    padding:  30px 20px 0;
                }
                .noCom i {
                    font-size : 100px;
                }
                .noCom > * {
                    margin : 0;
                }
                .con {
                    position : relative;
                    padding-bottom : 3rem;
                    height : 100%;
                    background : var(--white);
                }
                   .comments {
                       padding : 0 15px;
                       padding-top : 10px;
                    height : 100%;
                       overflow : auto;
                   }
                   .com {
                       position : absolute;
                       bottom : 0;
                       left : 0;
                       width : 100%;
                   }
                `}</style>
            </div>
        )
    }
}
