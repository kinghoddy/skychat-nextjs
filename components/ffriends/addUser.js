import React, { useState } from 'react';
import Img from '../UI/img/img'
import Link from 'next/link'
import firebase from '../../firebase';
import 'firebase/database'
import play from '../Audio/Audio';
import Toast from '../UI/Toast/Toast'
export default props => {
    const [toast, setToast] = useState(null)
    const [reqSent, setReqSent] = useState(false)
    const sendRequest = () => {
        setToast(null)
        var ref = firebase.database().ref("users/" + props.uid + "/requestsId/" + props.userData.uid);
        if (reqSent) {
            ref.remove().then(() => {
                setToast('Request Canceled')
                play('delete')
            })
            setReqSent(false)
        } else {
            ref
                .set(Date.now())
                .then(res => {
                    play('click')
                    setToast('Request Sent')
                })
            setReqSent(true)
        }
    };
    return <div className="profilePicture">
        {toast && <Toast>{toast}</Toast>}
        {props.src && <Link href="/[profile]" as={"/" + props.username}>
            <a className="img" > <Img alt="" src={props.src} /></a>
        </Link>
        }
        <div className="px-3"  >
            <h6 className="text-capitalize mb-0 mt-2 " >{props.fullName} </h6>
            <span className="name text-dark"  >{props.username}</span>
            {props.info && <React.Fragment>
                {props.info.bio && <span className="info " > <i className="fal mr-2 fa-info-circle" />
                    {props.info.bio.substring(0, 30)}...</span>}
                {props.info.address && <span className="info " > <i className="fa fa-location mr-2" />
                    {props.info.address}</span>}
                {props.info.email && <span className="info " > <i className="fa fa-envelope mr-2" />
                    {props.info.email}</span>}
            </React.Fragment>}

            <button className="btn btn-block btn-fav mt-2" onClick={sendRequest} >
                <i className="fal fa-user-plus mr-2 " /> {reqSent ? 'Cancel Request' : 'Add friend'}      </button>
        </div>
        {props.online && <span className="online" ></span>}
        <style jsx>{`
          .profilePicture {
              width : 100%;
              position: relative;
          }
                .info {
             display : block;
             color : var(--gray-dark);
             font-weight : 600;
         }
         
          .img {
              background : var(--light);
              height : 190px;
              display : block;
              border: 1px solid var(--gray);
              border-radius : 10px;
              overflow : hidden
          }
          .name {
              text-transform : capitalize;
              font-size : 12px;
              margin-top : 10px;
              margin-bottom : 0;
              
          }
          .name:hover {
              color : var(--gray) !important;
          }
          .online {
              height : 15px; 
              width : 15px;
              position: absolute;
              top : 5px;
              right : 5px;
              border-radius: 50%;
              border: 2px solid #fff;
              background : #3f3;
          }
        `}</style>
    </div>
} 