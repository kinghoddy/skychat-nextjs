import React, { useCallback, useRef, useState } from 'react'
import Modal from '../../UI/modal';
import 'firebase/database';
import 'firebase/storage'
import firebase from '../../../firebase';
import Input from '../../UI/input'
import Spinner from '../../UI/Spinner/Spinner';
import { useRouter } from 'next/router';
import AddParticipant from './AddParticipant';

function CreateGroup(props) {
    const [selected, setSelected] = useState({});

    const [step, setStep] = useState(0);
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [icon, setIcon] = useState('/img/group.svg')
    const router = useRouter();
    const addGroupIcon = () => {
        const input = document.createElement('input');
        input.type = "file";
        input.accept = 'image/*'
        input.click();
        input.addEventListener('change', e => {
            const file = input.files[0];
            const tempSrc = URL.createObjectURL(file);
            setIcon(tempSrc);
        })
    }
    const upload = async (blobUrl, key) => {

        let blob = await fetch(blobUrl).then(r => r.blob());
        const ref = firebase.storage().ref('groups/' + key + '/icon');
        ref.put(blob).then((snap) => {
            ref.getDownloadURL().then((url) => {
                callback(url.replace('icon', 'icon_1024x1024'))
            }).catch(() => {
                firebase.storage().ref('groups/' + key + '/icon_1024x1024').getDownloadURL().then(url => callback(url))
            });
            const callback = (url) => {
                firebase.database().ref('groups/' + key + '/metadata/icon').set(url)
            }
        });
    }
    const createGroup = () => alert('Coming Soon')
    const createGroups = () => {
        const ud = JSON.parse(localStorage.getItem('skychatUserData'));
        const groupKey = firebase.database().ref('groups').push().key;
        const updatedSelect = {};
        for (let keys in selected) {
            updatedSelect[keys] = {}
            updatedSelect[keys].addedBy = ud.uid
            updatedSelect[keys].username = selected[keys].username
            updatedSelect[keys].profilePicture = selected[keys].profilePicture;
            // setting groups in users
            firebase.database().ref('users/' + keys + '/groups/' + groupKey).set(Date.now());
        }
        firebase.database().ref('users/' + ud.uid + '/groups/' + groupKey).set(Date.now());

        const groupData = {
            metadata: {
                icon: icon,
                groupName,
                createdBy: {
                    username: ud.username,
                    uid: ud.uid,
                    profilePicture: ud.profilePicture,
                    fullName: ud.fullName,
                },
                groupDescription
            },
            members: {
                ...updatedSelect, [ud.uid]: {
                    owner: true,
                    username: ud.username,
                    admin: true,
                    profilePicture: ud.profilePicture
                }
            }
        }
        const ref = firebase.database().ref('groups/' + groupKey);
        if (icon.indexOf('blob:http') > -1) upload(icon, groupKey);
        router.prefetch('/messages/g/' + groupKey);
        ref.update(groupData);
        ref.child('chats').push({
            message: `${ud.username} created the group "${groupName}"`,
            sender: "skychat",
            date: Date.now()
        }).then(() => {
            router.push('/messages/g/' + groupKey);
            props.cancel();
        });
    }

    const increaseStep = () => {
        if (step === 1) createGroup();
        setStep(step + 1);
    }
    const decreaseStep = () => {
        if (step === 0) props.cancel();
        else setStep(step - 1)
    }
    return (
        <Modal cancel={props.cancel} >
            <div className="createGroup animated fadeInRight faster" >
                {step === 2 && <div className="createSpinner animated fadeInRight faster" >
                    <Spinner fontSize="8px" message="Creating Group" />
                </div>}

                <nav className="createGroup_nav" >
                    <button onClick={decreaseStep} className="back-button" >
                        <i className="fa fa-arrow-left" />
                    </button>
                    <div className="ml-2" >
                        <p className="gray" > New group</p>
                        <h6 className="text-uppercase" >
                            {step === 0 ? 'Add participants' : step === 1 ? 'Set Group Data' : ''}
                        </h6>
                    </div>
                    {step === 0 ?
                        <button className="btn btn-light ml-auto" onClick={increaseStep} disabled={Object.keys(selected).length < 2}  >Next
                    <i className="fal ml-2 fa-arrow-right" />
                        </button> : <button disabled={groupName.length < 1} className="btn btn-light ml-auto" onClick={increaseStep}  >Finish
                    <i className="fal ml-2 fa-check" />
                        </button>}
                </nav>
                {step === 0 ? <AddParticipant
                    selected={selected}
                    scrollContainer=".createGroup"
                    setSelected={(s) => setSelected(s)}
                    uid={props.uid}
                /> : <div className="p-2" >
                        <div className="group-icon" >
                            <img src={icon} />
                            <button className="btn mx-auto btn-fav rounded-pill px-3" onClick={addGroupIcon} >
                                <i className="fal fa-camera mr-2" /> Change
                            </button>
                        </div>
                        <Input type="text"
                            value={groupName}
                            onChange={e => setGroupName(e.target.value)}
                            label="Group Name"
                        />
                        <Input type="textarea"
                            value={groupDescription}
                            onChange={e => setGroupDescription(e.target.value)}
                            label="Group Description"
                        />
                    </div>}
            </div>

            <style jsx>{`
                .createGroup {
                 height : 100vh;
                 width : 100vw;
                 background : var(--white);
                 position : relative;
                 overflow-y : auto;
                 overflow-x : hidden;
                }
                .createSpinner {
                    position : absolute;
                    bottom : 0;
                    right : 0;
                    height : 100%;
                    width : 100%;
                    z-index : 100;
                    backdrop-filter : blur(20px);
                    background : #fff8;
                }
                .createGroup_nav {
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
                .createGroup_nav * {
                     margin-bottom : 0;
                     line-height : 1.4
                }
                .gray {
                    color : var(--gray-dark)
                }
                .group-icon {
                    display : flex;
                    align-items : center;
                    flex-direction : column                
                }
                .group-icon > img{
                    border-radius : 50%;
                        height : 7rem;
                        background : var(--secondary);
                    width : 7rem;
                    margin-bottom : 10px;
                    object-fit : cover;
                }
              @media (min-width : 1200px) {
                  .createGroup {
                      width : 30rem;
                      box-shadow : 0 10px 15px #0006;
                      height : 80vh;
                      border-radius : 10px;
                      top : 10vh;
                    }
                }
                
            `}</style>

        </Modal>
    )
}

export default CreateGroup
