import React, { useState } from 'react'
import Img from '../../UI/img/img';
import Modal from '../../UI/modal';
import AddParticipant from './AddParticipant';
import GroupUserList from './GroupUserList';
import firebase from '../../../firebase';
import 'firebase/database';
import EditGroup from './EditGroup';
import Router from 'next/router';
import Spinner from '../../UI/Spinner/Spinner';
import GroupInvite from './GroupInvite';
function GroupInfo({ id, cancel = () => { }, metadata = {}, members = {}, userData = {} }) {
    const [memList, setMemList] = useState([])
    const [isAdmin, setIsAdmin] = useState(false)
    const [addingUser, setAddingUser] = useState(false)
    const [selected, setSelected] = useState({})
    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState(false);
    const [showLink, setShowLink] = useState(true)
    React.useEffect(() => {
        let m = []
        for (let key in members) {
            m.push({
                ...members[key],
                uid: key,
                username: key === userData.uid ? 'You' : members[key].username,
                index: key === userData.uid ? 1 : 0,
                key
            })
        }
        m = m.sort((a, b) => a.username.localeCompare(b.username));
        setMemList(m.sort((a, b) => b.index - a.index))
        if (members[userData.uid] && members[userData.uid].admin) setIsAdmin(true)
        else setIsAdmin(false)
    }, [members, userData])
    const addMembers = () => {
        const ref = firebase.database().ref('groups/' + id);
        const updatedSelect = {};
        for (let keys in selected) {
            updatedSelect[keys] = {}
            updatedSelect[keys].addedBy = userData.uid
            updatedSelect[keys].username = selected[keys].username
            updatedSelect[keys].profilePicture = selected[keys].profilePicture;
            // setting groups in users
            firebase.database().ref('users/' + keys + '/groups/' + id).set(Date.now());
        }
        ref.child('members').update(updatedSelect);
        let st = Object.values(selected).map(cur => cur.username)
        let message = {
            date: Date.now(),
            sender: 'skychat',
            seen: {
                [userData.uid]: Date.now()
            },
            message: `${userData.username} added ${st.join(', ')}`
        }
        ref.child('chats').push(message)
        setAddingUser(false)
    }

    const exitGroup = () => {
        const db = firebase.database();
        setLoading('Leaving Group')
        if (confirm("Are you sure you want to leave this group")) db.ref('groups/' + id + '/members/' + userData.uid).remove().then(() => {
            db.ref("groups/" + id + "/chats").off()

            db.ref("users/" + userData.uid + "/groups/" + id).remove().then(() => db.ref("groups/" + id + "/chats/").push({
                date: Date.now(),
                sender: "skychat",
                seen: { [userData.uid]: Date.now() },
                message: userData.username + " left"
            }));


            Router.push("/messages");
            setLoading(false)
        })
        else setLoading(false)
    }
    // clearing selected if modal is closed
    React.useEffect(() => {
        if (!addingUser) setSelected([])
    }, [addingUser])
    return (
        <React.Fragment>
            {showLink && <GroupInvite
                metadata={metadata}
                members={members}
                userData={userData}
                cancel={() => setShowLink(false)}
                id={id}
            />}
            {addingUser && <Modal cancel={() => setAddingUser(false)}
            >
                <div className="animated fadeInRight addPartInGroupInfo" >
                    <nav className="nav" >
                        <button onClick={() => setAddingUser(false)} className="back-button" >
                            <i className="fa fa-arrow-left" />
                        </button>
                        <div className="ml-2" >
                            <small >
                                {metadata.name}
                            </small>
                            <h6 className="text-uppercase" >
                                Add members
                            </h6>
                        </div>
                        <button className="btn btn-light ml-auto" onClick={addMembers} disabled={Object.keys(selected).length < 1}  >Done
                    <i className="fal ml-2 fa-check" />
                        </button>
                    </nav>
                    <AddParticipant
                        scrollContainer=".addPartInGroupInfo"
                        selected={selected}
                        members={members}
                        setSelected={setSelected}
                        uid={userData.uid}

                    />
                </div>
            </Modal>}
            {editing && <Modal cancel={() => setEditing(false)}>
                <EditGroup
                    metadata={metadata}
                    userData={userData}
                    cancel={() => setEditing(false)}
                    id={id}
                />
            </Modal>}
            <div className=" groupInfo" >
                {loading && <div className="loading" >
                    <Spinner message={loading} />
                </div>}
                <div className="con"  >
                    <nav className="nav" >
                        <button onClick={cancel} className="back-button floating"  >
                            <i className="fal fa-times" />
                        </button>
                        <span className="nav-title" style={{ marginLeft: "15px" }} >Group Info</span>
                        {isAdmin && <button onClick={() => setEditing(true)} className="back-button floating right"  >
                            <i className="fa fa-pencil" />
                        </button>}
                    </nav>
                    <div className="icon" >
                        <Img src={metadata.icon} />
                    </div>
                </div>
                <div className="title" >
                    <h5>{metadata.name}</h5>
                    <p>Created Yesterday</p>
                </div>
                {/* Description */}
                <div className="con" >
                    <header>Group Description</header>
                    <p>{metadata.description}</p>
                </div>
                {/* Settings */}
                {isAdmin && <div className="con" >
                    <header>Group Settings</header>
                </div>}
                {/* Members */}
                <div className="con" >
                    <header>{memList.length} Members</header>
                    {isAdmin && <React.Fragment>
                        <button
                            onClick={() => setAddingUser(true)}
                            className="btn btn-block mt-2 btn-light" >
                            <i className="text-danger fal fa-user-plus mr-2" />
                    Add member</button>

                        <button className="btn btn-block mt-2 btn-light" onClick={() => setShowLink(true)} >
                            <i className="text-info fal fa-link mr-2" />
                    Invite Via Link</button>
                    </React.Fragment>}

                    {memList.map((cur, i) => <GroupUserList id={id} userData={userData} isAdmin={isAdmin} {...cur} />)}
                </div>
                {/* Danger Zone */}
                <div className="con" >
                    <header className="mb-2" >Danger Zone</header>
                    <button className="btn-block btn btn-outline-danger" onClick={exitGroup} >Exit Group</button>
                </div>
            </div>

            <style jsx>{`
               .groupInfo {
                   height : 100%;
                   width : 100%;
                   overflow : auto;
                   position : relative;
               }
               .loading {
                   position : fixed;
                   top : 0;
                   left : 0;
                   height : 100%;
                   width : 100%;
                   z-index : 500;
                   background : #fffc;
               }
               .floating {
                   position : fixed;
                   left : auto;
                   top : auto;
                   z-index : 150
               }
               .right {
                   right : 25px;
               }
               .nav {
                   padding : 10px;
                   display : flex;
                   align-items : center;
                   line-height : 1;
               }
               .nav-title {
                   color : var(--gray-dark);
                   padding : 0 10px;
               }
               .con {
                   background : var(--white);
                   padding : 10px;
                   margin-bottom : 10px;
               }
               .con header {
                   color : var(--warning);
                   font-size : 12px;
                   text-transform : capitalize;
               }
               .title {
                   position : sticky;
                   top : 0;
                   background : var(--white);
                   padding : 5px;
                   z-index : 100;
                   text-align : center;
                   margin-top : -10px;
                   margin-bottom : 10px;
               }
               .title > * {
                   line-height : 1.3;
                  margin : 0;
               }
               .title > p {
                   color : var(--gray-dark);
               }
                .icon {
                   height : 10rem;
                   width :   10rem;
                   border-radius : 50%;
                   overflow : hidden;
                   margin : 0px auto ;
               }
              .addPartInGroupInfo {
                 height : 100vh;
                 width : 100vw;
                 background : var(--white);
                 position : relative;
                 overflow-y : auto;
                 overflow-x : hidden;
                }
                .addPartInGroupInfo .nav {
                     background : var(--white);
                    display : flex;
                    box-shadow : 0 3px 5px #0000;
                    align-items : center;
                    position : sticky;
                    top : 0;
                    z-index : 10;
                    margin-bottom : 20px;
                    padding : 5px 10px;
                }
                  .addPartInGroupInfo  ..nav  * {
                     margin-bottom : 0;
                     line-height : 1.4
                }
               @media (min-width : 1200px) {
                    .groupInfo {
                        width : 100%;
                        height : 100%;
                        position : relative;
                        z-index : 1;
                    }
                       .addPartInGroupInfo {
                      width : 30rem;
                      box-shadow : 0 10px 15px #0006;
                      height : 80vh;
                      border-radius : 10px;
                      top : 10vh;
                    }
               }
            `}</style>

        </React.Fragment>

    )
}

export default GroupInfo
