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
import SharePop from './share-pop';
import Info from './info';
import LazyLoad from 'react-lazyload';
export default class Post extends React.Component {
    state = {
        post: {
            media: [],
            icon: '/img/avatar-red.png'
        },
        likes: [],
        likeeId: this.props.likeeId,
        commentsLength: 0,
        likesLength: 0,
        sharesLength: 0,
        liked: null,
        shared: false,
        sharedFrom: null,
        views: 0,
        sharing: false,
        popover: false,
        isMine: false,
        fullPost: false,
        readMore: false,
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
                let ud = JSON.parse(localStorage.getItem('skychatUserData'))
                let n = {
                    title: ud.username + ' and ' + this.state.likesLength + ' others liked your post',
                    icon: (this.state.post.media[0] && this.state.post.media[0].type === 'image') && this.state.post.media[0].src || ud.profilePicture,
                    link: '/post/' + this.props.id,
                    date: Date.now()
                }
                if (!this.state.isMine) firebase.database().ref('users/' + this.props.uid + '/notification').push(n)
                play('like')
                if (this.state.sharedFrom) firebase.database().ref('posts/' + this.state.sharedFrom.pid + '/likes/' + this.state.likeeId).set(Date.now());
                ref.set(Date.now());
                this.setState({ liked: true });
            }
        }
    };
    getShares = () => {
        let sharesLength = 0;
        if (this.props.shares) {
            if (this.props.shares[this.props.likeeId]) this.setState({ shared: true })
            sharesLength = Object.keys(this.props.shares).length;
            this.setState({ sharesLength });
        }
    }
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
        let likesLength = 0
        if (this.props.likes) {
            likesLength = Object.keys(this.props.likes).length;
            if (this.props.likes[this.props.likeeId]) this.setState({ liked: true })
        }

        this.setState({ likesLength })
        firebase
            .database()
            .ref("posts/" + this.props.id + "/likes")
            .on("value", (snap) => {
                this.setState({ likesLength: snap.numChildren() });
            });
    };
    getPost = () => {
        this.getShares()
        this.getLikes();
        this.getComments();

        let networkState = window.navigator.onLine;
        let m = [];
        if (this.props.media) {
            for (let keys in this.props.media) m.push({ ...this.props.media[keys] })
        }
        this.setState({
            loading: networkState,
            post: { ...this.props, media: m, body: formatLink(this.props.body) },
            views: Object.keys(this.props.views || {}).length,
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
                let views = Object.keys(s.val().views || {}).length


                firebase
                    .database()
                    .ref("users/" + post.uid)
                    .once("value", (snap) => {
                        post.username = snap.val().username;
                        post.icon = snap.val().profilePicture;
                        post.online = snap.val().connections;
                        this.setState({ loading: false, post, views });
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
    componentWillUnmount() {
        firebase.database().ref('posts/' + this.props.id + '/comments').off()
    }
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
        if (this.props.sharedFrom) this.setState({ sharedFrom: this.props.sharedFrom })
        this.getPost();
    }
    copyLink = () => {
        this.setState({ toast: null })
        window.navigator.clipboard
            .writeText("https://skychat.tk/post/" + this.props.id)
            .then((res) => {
                this.setState({ toast: "Link copied to clipboard" });
            });
    }
    share = async () => {
        this.setState({ toast: null })
        const shareData = {
            title: this.state.post.username + ' added a post ' + (this.state.post.title || ''),
            text: this.state.post.body || '',
            url: 'https://skychat.tk/post/' + this.props.id,
        }
        const shareText = shareData.title + '\n' + shareData.text + '\n' + shareData.url
        try {
            await navigator.share(shareData);
            this.setState({ toast: 'Shared Successfully' })
        } catch (err) {
            try {
                window.Android.share(shareText);
            } catch (err) {
                // alert(err)
                this.setState({ toast: 'Error: ' + err });
            }
        }

    }
    rePost = (title) => {
        if (this.state.likeeId) {
            let ud = JSON.parse(localStorage.getItem('skychatUserData'))
            const post = {
                body: this.props.body,
                icon: ud.profilePicture,
                title,
                username: ud.username,
                uid: ud.uid,
                media: this.state.post.media,
                date: Date.now(),
                sharedFrom: {
                    pid: this.props.id,
                    username: this.state.post.username,
                    icon: this.state.post.icon,
                    uid: this.props.uid,
                    date: this.props.date,
                },
                type: 'shared'
            }
            if (!this.state.shared) firebase.database().ref('posts').push(post).then(() => {
                play('success');
                let n = {
                    title: '<b>' + ud.username + '</b> and <b>' + this.state.sharesLength + '</b> others shared your post',
                    icon: (this.state.post.media[0] && this.state.post.media[0].type === 'image') && this.state.post.media[0].src || ud.profilePicture,
                    link: '/post/' + this.props.id,
                    date: Date.now()
                }
                firebase.database().ref('users/' + this.props.uid + '/notification').push(n);
                firebase.database().ref('posts/' + this.props.id + '/shares/' + ud.uid).set(Date.now());
                if (this.state.sharedFrom) firebase.database().ref('posts/' + this.state.sharedFrom.pid + '/shares/' + ud.uid).set(Date.now());
                this.setState({ sharesLength: this.state.sharesLength + 1 })
            });
            else alert('Post already shared by you');
        } else {
            alert('You have to login first');
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
    readMore = e => {
        e.preventDefault();
        this.setState({ readMore: !this.state.readMore })
    }
    setViewed = (e) => {
        firebase.database().ref('posts/' + this.props.id + '/views/' + this.props.likeeId).set(Date.now());
        if (this.state.sharedFrom) firebase.database().ref('posts/' + this.state.sharedFrom.pid + '/views/' + this.props.likeeId).set(Date.now());
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
            icon: 'fa-share-alt'
        }
        ];
        if (this.state.isMine) {
            b.push({
                title: 'Delete Post',
                action: this.delete,
                icon: 'fa-trash'
            })
        }
        return this.state.deleted ? null : <LazyLoad height={200} offset={100}>
            <div className="post">
                {this.state.toast && <Toast>{this.state.toast}</Toast>}
                <FullPost
                    cancel={() => this.setState({ fullPost: false })}
                    post={{ ...this.state.post }}
                    show={this.state.fullPost}
                />
                <Info
                    show={this.state.showInfo}
                    {...this.props}
                    focus={this.state.focusCom} isMine={this.state.isMine} post={this.state.post} commentsLength={this.state.commentsLength}
                    cancel={() => this.setState({ showInfo: false })}
                />
                <SharePop
                    share={this.share}
                    rePost={this.rePost}
                    show={this.state.sharing}
                    cancel={() => this.setState({ sharing: false })} />

                <Popover buttons={b} id={this.props.id}
                    show={this.state.popover} cancel={() => this.setState({ popover: false })} />
                <div className="header">
                    <PPicture src={this.state.post.icon} size='40px' online={this.state.post.online} />
                    <Link href='/[profile]' as={'/' + this.state.post.username} >
                        <a className="ml-3">
                            <h6 className="mb-0 text-capitalize" >
                                {this.state.post.username}
                                {this.state.sharedFrom && <small className="pl-3">
                                    <i className="fa fa-share text-warning mr-1" />
                                Shared</small>}
                            </h6>
                            <small>{dateFormat(this.state.post.date, true)}</small>
                        </a>
                    </Link>
                    <button className="ml-auto rounded-circle px-3 btn-more" onClick={() => this.setState({ popover: true })}>
                        <i className="fal fa-ellipsis-v fa-2x " />
                    </button>
                </div>

                {this.state.post.title && (
                    <h3 className="mb-0 post_title">{this.state.post.title}</h3>
                )}
                {this.state.sharedFrom && <div className={"header shared " + (!this.state.post.body && 'mb-2 ')}>
                    <PPicture src={this.state.sharedFrom.icon} size='30px' />
                    <Link href='/[profile]' as={'/' + this.state.sharedFrom.username} >
                        <a className="ml-3">
                            <h6 className="mb-0 text-capitalize" >
                                {this.state.sharedFrom.username}
                            </h6>
                            <small  >{dateFormat(this.state.sharedFrom.date, true)}</small>
                        </a>
                    </Link>
                    <Link href="/post/[pid]" as={"/post/" + this.state.sharedFrom.pid} >
                        <a className="origin" >View original</a>
                    </Link>
                </div>
                }
                {this.state.post.body && (<div className="post_body">

                    <div

                        dangerouslySetInnerHTML={{ __html: this.state.readMore ? this.state.post.body : this.state.post.body.substring(0, 200) + (this.state.post.body.length > 200 ? '...' : '') }}
                    ></div>
                    {this.state.post.body.length > 200 &&
                        <a className="btn btn-sm rounded-pill mt-2 btn-block btn-outline-dark" href="#" onClick={this.readMore}>{this.state.readMore ? 'See less' : 'Continue Reading...'}</a>}
                </div>
                )}
                {this.props.media && this.state.post.media.length < 1 && this.state.loading && <Placeholder style={{ height: "300px" }} />}

                {this.state.post.media.length > 0 && <Media setViewed={this.setViewed} show={(s) => this.setState({ fullPost: s })} freeze sources={this.state.post.media} />}
                <div className="buttons">
                    <button onClick={this.like} >
                        <i className={(this.state.liked ? 'fa' : 'fal') + ' fa-heart'} style={{ color: this.state.liked ? 'red' : 'var(--black)' }} />
                    </button>
                    <button onClick={() => {
                        if (this.props.likeeId) {
                            this.setState({ focusCom: true, showInfo: true })

                        } else {
                            alert('Login to like comment , and share ')
                        }

                    }}>
                        <i className='fal fa-comment-minus' />
                    </button>
                    <button onClick={() => this.setState({ sharing: true })} >
                        <i className='fal fa-share' />
                    </button>
                    {this.state.views > 0 && <div className="views" > {this.state.views} <i className="fa fa-play text-warning ml-1" /></div>}
                </div>
                <div onClick={() => this.setState({ showInfo: true })} className="post_info">
                    <span>
                        <strong className="text-capitalize pr-1">
                            {this.state.likesLength}
                        </strong>{" "}
            Like{this.state.likesLength !== 1 ? "s" : null}
                    </span>
                    <span>
                        <strong className="text-capitalize pr-1">
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
                {(this.state.likeeId && this.state.commentsLength > 0 || this.state.clicked) && <Comment focus={this.state.focusCom} isMine={this.state.isMine} uid={this.props.uid} id={this.props.id} post={this.state.post} commentsLength={this.state.commentsLength} />}
                <style jsx>{`
            .post {
            margin-bottom: 15px;
            background: var(--white);
        }
        .btn-more {
            background : none;
            color : var(--gray-dark)
        }
        .btn-more:hover {
            background : var(--gray);

        }
        .header {
            display : flex;
            align-items : center;
            line-height : 1.05;
            padding : 10px 15px;
        }
        .header h6 {
            color : var(--black);
            font-weight : 700;
            font-size : 15px;
            text-transform : unset !important
        }
        .header small {
            font-size : 12px;
            color : var(--gray-dark)
        }
        .shared {
            border : 1px solid var(--secondary);
            margin : 10px 15px 0 15px;
            padding : 7px 17px;
        }
        .origin {
            font-size : 13px;
            font-weight : 400;
            margin-left : auto;
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
    white-space : pre-line;
  word-break : break-word;
  font-size : 20px;
  text-transform :unset !important;
  line-height : 1.3;
  font-family : arial , Helvatica , serif;
  font-weight : 500;
}
.post_body {
  font-size : 15px;
  white-space : pre-line;
  word-break : break-word;
  padding:  10px 18px;

}
.post_info {
    cursor : pointer;
  padding: 7px 10px;
  display: flex;
  justify-content: space-between;
}
.post_info:active {
    background : var(--gray);
}
.post_info span {
  font-size: 11px;
  font-weight : 700;
}
.views {
      font-size: 13px;
      padding-right:   15px;
margin-left : auto
}
.buttons {
  align-items : center;
      padding:5px;
  display: flex;
}
.buttons  button {
    background : none;
    font-size : 18px;
    color : var(--black);
    margin : 0 10px;
    border-radius : 30px;
}
.buttons button:active {
    background : var(--fav);
    color : #fff;
}
@media (min-width : 1200px) {
    .post {
        border-radius : 7px;
        box-shadow : 0 1px 5px #0002;
    }
}
           `}</style>
            </div>
        </LazyLoad>
    }
}