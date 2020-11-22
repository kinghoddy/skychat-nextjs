import Link from 'next/link'
import React, { useState } from 'react'
import Modal from '../UI/modal'
import ProfilePicture from '../UI/profilePicture'
import SwipableTab from '../UI/swipable-tab';
import firebase from '../../firebase'
import Spinner from '../UI/Spinner/Spinner';
import Comments from './comments';

export default function Info(props) {
    const [likes, setLikes] = useState([]);
    const [likesLoaded, setLikesLoaded] = useState(false)
    const getLikes = () => {
        firebase.database().ref('posts/' + props.id + '/likes').on('value', snap => {
            let Likes = []
            if (snap.val()) {
                for (let keys in snap.val()) {
                    firebase
                        .database()
                        .ref("users/" + keys)
                        .once("value", (s) => {
                            if (s.val()) {
                                let user = {
                                    username: s.val().username,
                                    fullName: s.val().fullName,
                                    online: s.val().connections,
                                    profilePicture: s.val().profilePicture,
                                    date: snap.val()[keys]

                                };
                                Likes.push({ ...user, date: snap.val()[keys] });
                                Likes.sort((a, b) => {
                                    return b.date - a.date;
                                });
                                setLikesLoaded(true)
                                setLikes(Likes.reverse())
                            }
                        });
                }
            } else {
                setLikes(Likes)
            }
        })
    }
    React.useEffect(() => {
        getLikes();

    }, [props.id])

    return (props.show ? <Modal cancel={props.cancel} >
        <div className="infoCon animated fadeInUp faster" >
            <header>
                <button onClick={props.cancel} >
                    <i className="fa fa-arrow-left" />
                </button>
                <h6>Info</h6>
            </header>
            <div className="tab" >

                <SwipableTab
                    autoFocus={props.focus ? 1 : null}
                    tabNav={[
                        {
                            id: 'likes',
                            text: <React.Fragment>
                                <i className="fa fa-heart mr-2" style={{ color: 'var(--red)' }} />
                                <span> {likes.length} Likes</span>
                            </React.Fragment>
                        },
                        {
                            id: 'comments',
                            text: <React.Fragment>
                                <i className="fa fa-comment mr-2" style={{ color: 'var(--primary)' }} />
                                <span> {props.commentsLength} Comments</span>
                            </React.Fragment>
                        }
                    ]}
                    tabContent={[
                        {
                            id: 'likes',
                            component: <div className="con" >

                                {!likesLoaded && <div style={{ height: '5rem' }} > <Spinner fontSize="3px" /></div>}
                                {likes.map(cur => <div className="like" >
                                    <ProfilePicture src={cur.profilePicture} online={cur.online} size="45px" />
                                    <Link href={'/[profile]'} as={'/' + props.username} >
                                        <a className="title" >
                                            <h6>{cur.fullName}</h6>
                                            <span>{cur.username}</span>
                                        </a>
                                    </Link>
                                </div>)}
                            </div>
                        }, {
                            id: 'comments',
                            component: <Comments {...props} fullDisplay />
                        }
                    ]}
                />
            </div>

            <style jsx>{`
            header {
                display: flex ;
                background : var(--white);
                padding : 10px;
                align-items : center
            }
            header button {
                background : none;
            }
            header i {
                font-size : 20px;
            }
            header h6 {
                font-size : 20px;
                margin-bottom : 0;
                line-height : 1;
                margin-left : 20px
            }
            .infoCon {
                width : 100vw;
                display : flex;
                background : var(--white);
                flex-direction : column;
                height : 100vh;
            }
            .tab {
                flex : 1;
            }
           .like {
               display : flex;
               align-items : center;
               padding : 10px 15px;
           }
           .title {
               line-height : 1.05;
               padding-left : 15px;
           }
           .title > * {
               margin : 0;
           }
           .title h6 {
               color : var(--black);
               text-transform : capitalize;
               font-size : 15px;
               font-weight : 700;
           }
           .title span {
               color : var(--gray-dark);
               font-weight : 400;
               font-size  : 13px;
           }
           @media only screen and (min-width : 760px ) {
               .infoCon {
                   max-width : 40rem;
               }
           }
        `}</style>
        </div>

    </Modal> : null

    )
}


/*
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
                                        fullName: s.val().fullName,
                                        online: s.val().connections,

                                        profilePicture: s.val().profilePicture,
                                        date: snap.val()[keys]

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
                */