import React, { useState } from 'react'
import Input from '../../UI/input';
import firebase from '../../../firebase';
import 'firebase/database'
import Img from '../../UI/img/img'


function EditGroup({ metadata = {}, id, cancel, userData = {} }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [updated, setUpdated] = useState(false)
    const [loading, setLoading] = useState(false)
    React.useEffect(() => {
        setName(metadata.name)
        setDescription(metadata.description)
    }, [metadata])
    React.useEffect(() => {
        if (name !== metadata.name || description !== metadata.description) setUpdated(true);
        else setUpdated(false)
    }, [metadata, name, description])

    const updateGroup = () => {
        setLoading(true);
        const form = {
            groupName: name,
            groupDescription: description
        }
        let m = null
        if (metadata.name !== name && metadata.description !== description) m = "name and description"
        else if (metadata.name !== name) m = "name"
        else if (metadata.description !== description) m = "description"

        firebase.database().ref('groups/' + id + "/metadata").update(form).then(() => {
            cancel();
            firebase.database().ref('groups/' + id + "/chats").push({
                date: Date.now(),
                sender: "skychat",
                seen: { [userData.uid]: Date.now() },
                message: `${userData.username} changed the group's ${m}`
            })
            setLoading(false)
        })
    }

    return (
        <div className="con animated fadeInRight" >
            <nav className="navbar shadow-sm navbar-light bg-white" >
                <button onClick={cancel} className="back-button" >
                    <i className="fa fa-arrow-left" />
                </button>
                <span className="ml-2 navbar-brand" >Edit Group Info</span>
                <button className="btn btn-light ml-auto" disabled={!updated} onClick={updateGroup} >Save</button>
            </nav>
            <main className="p-2" >
                <Input onChange={(e) => setName(e.target.value)} label="Group Name" value={name} />
                <Input onChange={(e) => setDescription(e.target.value)} type="textarea" label="Group Description" value={description} />
                <h6 className="mx-3 font-eight-bold" >Group Icon</h6>
                <div className="icon" >
                    <Img src={metadata.icon} />
                </div>
            </main>
            <style jsx>{`
            nav {
                position : sticky;
                top : 0;
            }
               .con {
                   height : 100vh;
                      position : relative;
                   width : 100vw;
                   overflow : auto;
                   background : var(--light)
               }
               .icon {
                   border-radius : 10px;
                   overflow : hidden;
                   max-height : 50vh;
                   margin : 10px;
               }
               @media (min-width : 1200px) { 
                   .con {
                       height : 80vh;
                       top : 10vh;
                       max-width : 30rem;
                       border-radius : 10px;
                       box-shadow : 0 10px 20px #0009;
                   }
               }
            `}</style>
        </div>
    )
}

export default EditGroup 
