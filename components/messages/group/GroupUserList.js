import React, { useState } from 'react'
import ProfilePicture from '../../UI/profilePicture'
import Popover from '../../popover';
import { useRouter } from 'next/router';
import firebase from '../../../firebase';
import 'firebase/database'
import Toast from '../../UI/Toast/Toast'

function GroupUserList(props) {
    const [showPop, setShowPop] = useState(false)
    const [loading, setLoading] = useState(false)
    const [popBtn, setPopBtn] = useState([])
    const [admin, setAdmin] = useState(false)
    const [toasts, setToasts] = useState([])
    React.useEffect(() => {
        setAdmin(props.admin)
    }, [props.admin])
    const makeAdmin = (value) => {
        setLoading(true)
        const ref = firebase.database().ref('groups/' + props.id);
        ref.child('members/' + props.uid + '/admin').set(value).then(() => {
            setLoading(false);
            setAdmin(value)
            ref.child('chats').push({
                date: Date.now(),
                sender: 'skychat',
                seen: {
                    [props.userData.uid]: Date.now()
                },
                message: `${props.username} is ${value ? 'now' : "no more"} an admin`
            })
            setToasts([...toasts, `${props.username} is ${value ? 'now' : "no more"} an admin`])
        });
    }
    const removeMember = () => {
        setLoading(true)
        const ref = firebase.database().ref('groups/' + props.id);
        let c = confirm("Are you sure you want to remove " + props.username + " from the group")
        if (c) ref.child('members/' + props.uid).remove().then(() => {
            setLoading(false)
            ref.child('chats').push({
                date: Date.now(),
                sender: 'skychat',
                seen: {
                    [props.userData.uid]: Date.now()
                },
                message: `${props.userData.username} removed ${props.username}`
            })
            setToasts([...toasts, 'Removed Successfully']);
            firebase.database().ref('users/' + props.uid + '/groups/' + props.id).remove()
        });
        else setLoading(false)
    }
    const router = useRouter();
    // creating the popover buttons
    React.useEffect(() => {

        let b = [
            {
                title: `View ${props.username}'s profile`,
                action: () => router.push('/' + props.username)
            },
            // {
            //     title: `Message ${props.username}`,
            //     action: () => router.push('/messages/t/' + props.uid)
            // }
        ]
        if (props.isAdmin) {
            if (!props.owner) b.push({
                title: admin ? `Dismiss ${props.username} as admin` : `Make ${props.username} an admin`,
                action: () => makeAdmin(!admin)
            })
            b = [...b,
            {
                title: `Remove ${props.username}`,
                action: removeMember
            }
            ]

        }

        setPopBtn(b)
    }, [props, admin])
    return (
        <div className="GUserList" >
            {toasts.map((cur, i) => <Toast key={cur + i}>{cur}</Toast>)}
            <Popover
                id={props.username}
                cancel={() => setShowPop(false)}
                buttons={popBtn}
                show={showPop} />
            <ProfilePicture noBorder src={props.profilePicture} size="45px" online={props.online} />
            <div className="GUL_info" >
                <div>
                    <small className="mr-2">{props.username}</small>
                    {admin && <small className="admin" >admin</small>}
                    {props.owner && <small className="owner" >owner</small>}
                </div>
                <h6>{props.fullName}</h6>
            </div>
            <button disabled={props.userData.uid === props.uid || loading} className="menu_btn" onClick={() => setShowPop(true)} >
                <i className={`fa fa-${loading ? 'cog fa-spin' : 'ellipsis-v'}`} />
            </button>
            <style jsx>{`
               .GUserList {
                   display : flex;
                   align-items : center;
                   padding : 10px;
                   margin :  10px 0 ;
                   user-select : none;
                   background : var(--light);
               }
               .GUserList:hover {
                   background :  var(--gray);
               }
               .GUL_info {
                   padding : 0 10px;
                   line-height : 1;
               }
               .GUL_info > * {
                   margin : 0;
               }
               .GUL_info > h6 {
                   font-weight : 700;
                   margin-top : 1px;
                   text-transform : capitalize;
               }
               .owner,
               .admin {
                   font-weight : 700;
                   border : 1px solid  #dc2;
                   padding : 2px 5px;
                   display : inline-block;  
                   color : #db1;
                   margin : 0 3px;
               }
               .owner {
                   border : 1px solid  #0a3;
                   color : #0a3
               }
               .menu_btn {
                   background : none ;
                   margin-left  :auto
               }
            `}</style>
        </div>
    )
}

export default GroupUserList
