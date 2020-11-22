import React, { useState } from 'react'
import Modal from '../UI/modal'
import ProfilePicture from '../UI/profilePicture';

export default function SharePop(props) {
    const [userData, setUserData] = useState({});
    const [text, setText] = useState('');
    const changed = e => {
        setText(e.target.value)
    }
    const share = () => {
        props.cancel();
        setText('')
        props.rePost(text)
    }
    React.useEffect(() => {
        const ud = JSON.parse(localStorage.getItem('skychatUserData'));
        if (ud) setUserData(ud)
    }, []);
    return (props.show ? <Modal cancel={props.cancel}  >
        <div className={"con fadeInUp faster animated"} >
            <nav  >
                <ProfilePicture size="40px" src={userData.profilePicture} />
                <div className="ml-2" >
                    <h6 className="mb-0" >{userData.username}</h6>
                    <small>Sharing to news feed</small>
                </div>
                <button className="cancel" onClick={props.cancel} >
                    <i className="fal fa-times" />
                </button>
            </nav>
            <div className="editor" >
                <textarea rows="4" value={text} onChange={changed} placeholder="Write something about this post" />
                <button onClick={share} className="share btn btn-fav" > <i className="fal fa-share mr-2" /> Share now </button>
            </div>
            <ul>
                <li>
                    <button onClick={() => {
                        props.cancel();
                        props.share()
                    }} className="" >
                        <i className="fal fa-share-alt" />
                        <span>
                            More Options
                            </span>
                    </button>
                </li>
            </ul>
        </div>
        <style jsx>{`
            .con {
                width : 100vw;
                max-width : 40rem;
                background : var(--white);
                position : relative;
            }
    
                 nav {
                     display : flex;
                     padding : 10px;
                     align-items : center;
                     line-height : 1
                    }
                    nav small {
                        color : var(--gray-dark)
                    }
                    .cancel {
                        margin-left : auto;
                        background : none ;
                        color : var(--dark)
                    }
                    .editor {
                       position : relative ;
                       height : auto
                    }
                    .editor textarea {
                        width : 100%;
                        padding : 10px;
                        background : none;
                        color : var(--black);
                        font-weight : 700
                    }
                    .editor textarea::placeholder {
                        font-weight : 400;
                    }
                    .editor .share {
                        position : absolute ;
                        right : 10px;
                        bottom : 10px;
                        border-radius : 9px;
                    }
                ul {
                    list-style : none;
                    margin : 0;
                    padding : 0;
                    border-top : 1px solid var(--gray)
                }
                li {
                    width : 100%;
                }
                li > * {
                    width : 100%;
                    display : flex;
                    align-items: center;
                    padding :  10px 15px;
                    background : none;
                    color : var(--black)
                }
                li > * span {
                    padding-left : 15px;
                    text-transform : capitalize  
                }
                li > *:focus {
                    background : var(--secondary);
                }
                @media (min-width : 760px) {
                    .con {
                        top : 8rem;
                    }
                }
            `}</style>
    </Modal> : null
    )
}

