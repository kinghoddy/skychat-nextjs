import React, { useState } from 'react';
import ProfilePicture from './UI/profilePicture';
import Img from './UI/img/img'
import Link from 'next/link'
import firebase from '../firebase';
import 'firebase/database'
const CoverProfileLess = props => {

    const [loaded, setLoaded] = useState(false)

    // functions

    React.useEffect(() => {


        setLoaded(true)
    }, [props.uid])
    return <div className="con" >

        <div className="cover">
            {loaded && <Img src={props.coverPhoto} />}
        </div>
        <div className="profile">
            {loaded && <ProfilePicture size="100px" src={props.profilePicture} online={props.connections} />}
            <Link href="/[profile]" as={'/' + props.username} >
                <a className="names">

                    <h3>{props.fullName}</h3>
                    <h5>{props.username}</h5>
                </a>
            </Link>

        </div>

        <style jsx>{`
        .con {
            position : relative;
            box-shadow: 0 0px 3px 2px #0001;
            background : var(--white);
        }
        .cover {
            height : 7rem;
            width : 100%;
        }
        .profile {
            display : flex;
            padding : 10px;
            padding-left :10%;
            margin-top : -5rem;
            align-items : flex-end
        }
        .names {
            margin-top :75px;
            padding : 0 10px;
            color : var(--dark)
        }
        .names > h3 {
            margin-bottom : 0;
            font-weight: 600;
            font-size: 20px;
        }
        .names h5 {
            font-weight : 400;
            font-size : 13px;
            margin-bottom : 0;
            text-transform : capitalize;
        }
        @media (min-width : 1200px) {
            .cover {
                height : 30vh
            }
        }
        `}</style>
    </div>
}

export default CoverProfileLess