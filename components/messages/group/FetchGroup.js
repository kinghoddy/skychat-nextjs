import React, { useState } from 'react'
import Modal from '../../UI/modal'
import ProfilePicture from '../../UI/profilePicture'
import firebase from '../../../firebase';
import 'firebase/database';
import date from '../../date';
import { Router } from 'next/router';

function FetchGroup({ cancel, id, fetched }) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({})
    const [userData, setUserData] = useState({})
    const getData = async (id) => {
        const req = await firebase.database().ref('groupDeepLinks').orderByChild('uniqueId').equalTo(id).once('value');
        const res = await req.toJSON();
        let Data = {}
        for (let keys in res) Data = {
            ...res[keys],
            id: keys
        }
        setData(Data)
    }
    React.useEffect(() => {
        const ud = localStorage.getItem('skychatUserData');
        if (ud) setUserData(JSON.parse(ud))
    }, [])
    const joinGroup = () => {
        const gRef = firebase.database().ref('groups/' + id);
        gRef.child('members/' + userData.uid).once('value', s => {
            if (s.exists()) {
                Router.push('/messages/g/' + id)
            } else {
                gRef.child('members/' + userData.uid).update({
                    addedBy: 'link',
                    username: userData.username,
                    profilePicture: userData.profilePicture
                });
            }
        })
    }
    React.useEffect(() => {
        if (fetched) setData(fetched)
    }, [fetched])

    return (<Modal cancel={cancel} id={id}  >

        <div className="con" >
            {loading ? <div className="spinner-border " /> : data.metadata && <div className="group" >
                <div className="icon" >
                    <ProfilePicture borderColor='var(--white)' src={data.metadata.icon} size="150px" />
                </div>
                <h6 className="title">{data.metadata.name}</h6>
                <p className="description">{data.metadata.description} <br />
                    <b>Created {date(data.metadata.createdBy.date)} </b>
                </p>
                <span className="text-warning" >{data.members} Members</span>
                <div className="created" >
                    <ProfilePicture size="40px" noBorder src={data.metadata.createdBy.profilePicture} />
                    <span className="ml-2">Created by <b>{data.metadata.createdBy.username}</b></span>
                </div>
                <div className="buttons" >
                    <button onClick={cancel} style={{ borderRight: '1px solid var(--gray)' }} >Cancel</button>
                    <button className="text-primary">Join Group</button>
                </div>
            </div>}
        </div>
        <style jsx>{`
          .con {
              background : var(--white);
              width : 100vw;
              border-radius : 15px 15px  0 0;
              box-shadow : 0 3-px 10px #0004;

          }
          .group {
              padding :  15px ;
              text-align : center;
              display : flex;
               justify-content : center;
              flex-direction : column;
          }
          .icon {
              margin : -80px auto 0 auto
          }
          .title {
              color : var(--black);
              font-weight : 600;
              margin : 0
          }
          .description {
              color : var(--gray-dark);
              font-size : 13px;
              margin-bottom : 5px;
          }
          .created {
              display : flex;
              align-items : center;
              justify-content : center;
          }
          .buttons {
              display : flex;
              margin-top : 10px;
              border-top : 1px solid var(--gray);
          }
          .buttons button  {
              background : none;
              text-transform : uppercase;
              border-radius : 6px;
              padding : 10px 10px;
              color : var(--dark);
              width : 50%;
            }
          .buttons  button:active {
                background : var(--gray);
            }
            @media (min-width : 1200px) {
                .con {
                    position : relative;
                    top : 20vh;
                    max-width : 40vw;
                    border-radius : 10px;
                    box-shadow : 0 3px 10px #0004;
                }
            }
          `}</style>
    </Modal>
    )
}

export default FetchGroup
