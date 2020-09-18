import React from 'react';
import PPicture from '../UI/profilePicture';
import firebase from '../../firebase';
import 'firebase/database';
import 'firebase/storage';
import formatLink from '../formatLink'
import dateFormat from '../date'
import Placeholder from '../UI/placeholder';
import Link from 'next/link'
import Media from './media'
import Popover from '../popover';
import Toast from '../UI/Toast/Toast';
import FullPost from './fullPost'
import Comment from './comments';
import play from '../Audio/Audio'
export default class Post extends React.Component {
    state = {
        post: {
            media: [],
            icon: '/avatar-red.png'
        },
        likeeId: this.props.likeeId,
        commentsLength: 0,
        likesLength: 0,
        liked: null,
        shares: [],
        sharesLength: 0,
        lastLike: null,
        popover: false,
        isMine: false,
        fullPost: false,
        focusCom: false

    }
    like = () => {
        if (this.state.likeeId) {
            const ref = firebase
                .database()
                .ref("posts/" + this.props.id + "/likes/" + this.state.likeeId);
            if (this.state.liked) {
                this.setState({ liked: null });
                ref.set(null);
            } else {
                ref.set(Date.now());
                this.setState({ liked: true });
            }
        }
    };
    getComments = () => {
        this.setState({ commentsLoading: true });
        let commentsLength = 0;
        if (this.props.comments) {
            commentsLength = Object.keys(this.props.comments).length;
            this.setState({ commentsLength: commentsLength });
        }
        firebase
            .database()
            .ref("posts/" + this.props.id + "/comments")
            .on("value", (s) => {
                this.setState({ commentsLength: s.numChildren() });
            });
    };
    getLikes = () => {
        firebase
            .database()
            .ref("posts/" + this.props.id + "/likes")
            .on("value", (snap) => {
                this.setState({ likesLoading: true });
                let Likes = [];
                this.setState({ likesLength: snap.numChildren(), liked: false });
                if (snap.val()) {
                    for (let keys in snap.val()) {
                        if (keys === this.state.likeeId) {
                            this.setState({ liked: true });
                        }
                        firebase
                            .database()
                            .ref("users/" + keys)
                            .once("value", (s) => {
                                if (s.val()) {
                                    let user = {
                                        username: s.val().username,
                                        profilePicture: s.val().profilePicture,
                                    };
                                    Likes.push({ ...user, date: snap.val()[keys] });
                                    Likes.sort((a, b) => {
                                        return b.date - a.date;
                                    });
                                    const lastLikes = Likes[0];
                                    this.setState({
                                        likes: Likes.reverse(),
                                        lastLike: lastLikes,
                                        likesLoading: false,
                                    });
                                }
                            });
                    }
                }
            });
    };
    getPost = () => {
        let likesLength = 0;
        if (this.props.likes) {
            likesLength = Object.keys(this.props.likes).length;
        }

        let networkState = window.navigator.onLine;
        this.setState({
            loading: networkState,
            post: { media: [], ...this.props, body: formatLink(this.props.body) },
            likesLength: likesLength,
        });

        // createThumb();
        firebase
            .database()
            .ref("posts/" + this.props.id)
            .once("value", (s) => {
                let post = { ...this.state.post };
                for (let keys in s.val()) {
                    post[keys] = s.val()[keys];
                }
                // post.media : []
                post.body = formatLink(s.val().body);

                firebase
                    .database()
                    .ref("users/" + post.uid)
                    .once("value", (snap) => {
                        post.username = snap.val().username;
                        post.icon = snap.val().profilePicture;
                        post.online = snap.val().connections;
                        this.setState({ loading: false, post: post });
                    })
                    .catch(() => {
                        this.setState({ loading: false });
                    });
            })
            .catch(() => {
                console.log("load failed");
                this.setState({ loading: false });
            });
    };
    componentDidUpdate() {
        if (this.props.likeeId !== this.state.likeeId) {
            this.setState({ likeeId: this.props.likeeId });
        }
    }
    componentDidMount() {
        let uD = localStorage.getItem("skychatUserData");
        if (uD) {
            let userData = JSON.parse(uD);
            this.setState({ likeeId: userData.uid });
            if (this.props.uid === userData.uid) {
                this.setState({ isMine: true });
            }
        }
        this.getPost();
        this.getLikes();
        this.getComments();
    }
    copyLink = () => {
        this.setState({ toast: null })
        window.navigator.clipboard
            .writeText("https://skychat.vercel.app/post/" + this.props.id)
            .then((res) => {
                this.setState({ toast: "Link copied to clipboard" });
            });
    }
    share = async () => {
        this.setState({ toast: null })
        const shareData = {
            title: this.state.post.username + ' added a post ' + this.state.post.title,
            text: this.state.post.body,
            url: 'https://skychat.vercel.app/post/' + this.props.id,
        }
        try {
            await navigator.share(shareData);
            this.setState({ toast: 'Shared Successfully' })
        } catch (err) {
            this.setState({ toast: 'Error: ' + err });
        }
    }
    delete = () => {
        this.setState({ toast: null })
        let c = confirm('Are you sure you want to delete this post ? \n Click ok to continue');
        if (c) {
            this.state.post.media.forEach(cur => {
                firebase.storage().refFromURL(cur.src).delete();
            })
            firebase.database().ref('posts/' + this.props.id).remove().then(() => {
                play('delete')
                this.setState({ toast: 'Post deleted', deleted: true })
            });
        }
    }
    render() {
        let b = [{
            title: 'Reload Post',
            icon: 'fa-redo',
            action: this.getPost
        },
        {
            title: 'Copy Link',
            action: this.copyLink,
            icon: 'fa-copy'
        },
        {
            title: 'Share External',
            action: this.share,
            icon: 'fa-share'
        }
        ];
        if (this.state.isMine) {
            b.push({
                title: 'Delete Post',
                action: this.delete,
                icon: 'fa-trash'
            })
        }
        return this.state.deleted ? null : <div className="post shadow-sm">
            {this.state.toast && <Toast>{this.state.toast}</Toast>}
            <FullPost
                cancel={() => this.setState({ fullPost: false })}
                post={{ ...this.state.post }}
                show={this.state.fullPost}
            />
            <Popover buttons={b}
                show={this.state.popover} cancel={() => this.setState({ popover: false })} />
            <div className="d-flex align-items-center px-3 py-1">
                {this.state.loading ? <div className='pp' /> : <PPicture src={this.state.post.icon} size='40px' online={this.state.post.online} />}
                <Link href='/[profile]' as={'/' + this.state.post.username} >
                    <a className="ml-3 text-dark">
                        <h6 className="mb-0 text-capitalize">
                            {this.state.post.username}
                        </h6>
                        <small>{dateFormat(this.state.post.date)}</small>
                    </a>
                </Link>
                <button className="ml-auto rounded-circle px-3 btn-more" onClick={() => this.setState({ popover: true })}>
                    <i className="fal fa-ellipsis-v fa-2x " />
                </button>
            </div>
            {this.state.post.title && (
                <h4 className="mb-0 post_title">{this.state.post.title}</h4>
            )}
            {this.state.post.body && (
                <div
                    className="post_body"
                    dangerouslySetInnerHTML={{ __html: this.state.post.body }}
                ></div>
            )}
            {this.props.media && this.state.post.media.length === 0 && this.state.loading && <Placeholder style={{ height: "300px" }} />}

            {this.state.post.media.length > 0 && <Media show={(s) => this.setState({ fullPost: s })} freeze sources={this.state.post.media} />}
            <div className="buttons">
                <button onClick={this.like} >
                    <i className={(this.state.liked ? 'fa' : 'fal') + ' fa-heart'} style={{ color: this.state.liked ? 'red' : 'black' }} />
                </button>
                <button onClick={() => {
                    this.setState({ focusCom: true, clicked: true })
                    setTimeout(() => {

                        this.setState({ focusCom: false })
                    }, 1000)

                }}>
                    <i className='fal fa-comment-minus' />
                </button>
                <button>
                    <i className='fal fa-share' />
                </button>
            </div>
            <div className="post_info">
                <span>
                    <strong className="text-capitalize px-1">
                        {this.state.likesLength}
                    </strong>{" "}
            Like{this.state.likesLength !== 1 ? "s" : null}
                </span>
                <span>
                    <strong className="text-capitalize px-1">
                        {this.state.commentsLength}
                    </strong>{" "}
            Comment{this.state.commentsLength !== 1 ? "s" : null}
                </span>
                <span>
                    <strong className="text-capitalize px-1">
                        {this.state.sharesLength}
                    </strong>{" "}
            Share{this.state.sharesLength !== 1 ? "s" : null}
                </span>
            </div>
            {(this.state.commentsLength > 0 || this.state.clicked) && <Comment focus={this.state.focusCom} id={this.props.id} commentsLength={this.state.commentsLength} />}
            <style jsx>{`
            .post {
            margin-bottom: 10px;
            background: var(--white);
        }
        .btn-more {
            background : none;
        }
        .btn-more:hover {
            background : #eee
        }
        .pp {
            height : 40px;
            width : 40px;
            border : 2px solid #d31;
            border-radius : 50%;
            background : #eee ;
            background-size : contain
        }
        .post_title {
  padding:  10px 15px 0px;
  font-size : 1rem;
}
.post_body {
  font-size : 15px;
  line-height : 20px;
  padding:  10px 18px;
}
.post_info {
  padding: 0 10px 5px 5px;
  display: flex;
  justify-content: space-between;
}
.post_info span {
  font-size: 11px;
  color: var(--ion-color-dark);
}
.buttons {
      padding:5px;
  display: flex;
}
.buttons  button {
    background : none;
    font-size : 18px;
    margin : 0 10px;
    border-radius : 30px;
}
.buttons button:active {
    background : var(--fav);
    color : #fff;
}

           `}</style>
        </div>
    }
}