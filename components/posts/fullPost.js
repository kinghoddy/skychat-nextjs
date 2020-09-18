import React, { useState } from 'react';
import Img from '../UI/img/img';
import ProfilePicture from '../UI/profilePicture';
import Video from './video_full';
import dateFormat from '../date';
import Link from 'next/link'

const FullPosts = props => {
    const [showNav, setShowNav] = useState(true)
    return props.show ? <React.Fragment>
        <div className="backdrop" onClick={props.cancel} />
        <div className={"animated fadeIn faster con " + (props.post.media.length === 1 ? 'one' : '')} >
            <div className="background" onClick={() => setShowNav(!showNav)} />
            <nav className={(showNav ? 'show' : '') + " d-flex align-items-center px-3 py-1"}>
                <ProfilePicture src={props.post.icon} size='40px' online={props.post.online} />
                <Link href='/[profile]' as={'/' + props.post.username} >
                    <a className="ml-3 ">
                        <h6 className="mb-0 text-capitalize">
                            {props.post.username}
                        </h6>
                        <small>{dateFormat(props.post.date)}</small>
                    </a>
                </Link>
                <button className="ml-auto rounded-circle px-3 btn-more" onClick={props.cancel}>
                    <i className="fal fa-times fa-2x " />
                </button>
            </nav>
            <div className="overflow-auto" onClick={() => setShowNav(!showNav)} >
                {props.post.media.map((cur, i) => <div className="image" >
                    {cur.type === 'image' ? <Img objectFit="contain" maxHeight="90vh" alt="" src={cur.src} /> : <Video src={cur.src} />}
                </div>)}
            </div>
        </div>
        <style jsx>{`
        nav {
            position : absolute;
            top : -5rem;
            z-index : 1300;
            width : 100%;
            color : #000;
            background : var(--white);
            transition : all .5s;
            box-shadow : 0 3px 6px #0002;
        }
        nav.show {
            top : 0;
        }
        nav  * {
            color : inherit
        }
        .one nav {
            background : #0005;
            color : #fff;
        }
             .con {
                 position : fixed;
                 top : 0;
                 left : 50%;
                 transform : translateX(-50%);
                 z-index : 1300;
                 height : 100vh;
                 width : 100vw;
                 display : flex;
                 flex-direction : column ;
                 justify-content : ${props.post.media.length === 1 ? 'center' : 'unset'};
                 max-width : 40rem;
                 overflow : hidden;
                 background : var(--light);
                 padding-top :3.5rem ;
             }
             .one {
                 padding-top : 0;
             }
             .btn-more {
                 background : none ;
             }
             .overflow-auto::-webkit-scrollbar{
                 width : 1px;
             }
             .background {
                 position :absolute;
                 height : 100%;
                 width : 100%;
                 top : 0;
                 left : 0;
                 z-index : -1
                }
                .one .background {
                    background :  url(${props.post.media[0].src}) #000;
                    background-size : cover;
                    transform : scale(2);
                 filter : blur(20px) brightness(80%) ;
             }


            .image {
                background : #000;
               margin-bottom : 10px;
            }
                         .one .image {
                 background : none
             }
            @media (min-width : 1200px) {
                     .overflow-auto::-webkit-scrollbar{
                 width : 8px;
             }
            }
        `}</style>
    </React.Fragment> : null
}
export default FullPosts
