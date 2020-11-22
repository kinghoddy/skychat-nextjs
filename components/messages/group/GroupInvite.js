import React, { useRef, useState } from 'react'
import Modal from '../../UI/modal'
import ToggleSwitch from '../../UI/Toggler/ToggleSwitch';
import firebase from '../../../firebase';
import 'firebase/database'
import Toast from '../../UI/Toast/Toast';

function GroupInvite({ cancel, id, metadata, members = {} }) {
    const [enabled, setEnabled] = useState(true);
    const [loading, setLoading] = useState(false)
    const [groupLink, setGroupLink] = useState("Getting Link")
    const [toast, setToast] = useState([])

    React.useEffect(() => {
        getLink()
    }, [])
    const getLink = () => {
        if (metadata.deepLink) {
            setLoading(false);
            setGroupLink(metadata.deepLink);
        } else {
            createNewLink()
        }

    }
    const createNewLink = () => {
        const uniqueId = `${id.substr(5, 4)}-${Date.now().toString().substr(-6)}-${Math.floor(Math.random() * Date.now()).toString().substr(0, 4)}`;
        const link = "https://skychat.tk/j/" + uniqueId;
        console.log(link);
        setLoading(true)
        setGroupLink(link);
        firebase.database().ref('groupDeepLinks/' + id).update({
            metadata,
            uniqueId,
            members: Object.keys(members).length,
            top: {}
        }).then(() => {
            setLoading(false)
            firebase.database().ref('groups/' + id + '/metadata/deepLink').set(link);
        }).catch(err => {
            alert('An error occurred \n ' + err)
        })
    }
    const resetLink = () => {
        if (confirm('Are you sure you wan to reset the link for ' + metadata.name)) {
            createNewLink()
        }
    }
    const copyLink = (invite) => {
        let text = groupLink;
        if (invite) text = 'Join my skychat group using this link \n' + groupLink
        navigator.clipboard.writeText(text).then(() => {
            setToast([...toast, `Copied group  ${invite ? 'invite' : 'link'} to clipboard`])
        })
    }
    const share = () => {
        let action = navigator.share || function (data) { console.log(data) };
        if (window.Android) action = window.Android.share
        action({
            title: "Join my skychat group using this link",
            link: groupLink
        })
    }

    const buttons = [
        {
            text: "copy Invite",
            action: () => copyLink(true),
            icon: "link"
        },
        {
            text: "copy link",
            action: copyLink,
            icon: "copy"
        }, {
            action: share,
            text: "More options",
            icon: "share-alt"
        }, {
            text: "Reset Link",
            action: resetLink,
            icon: "redo"
        }

    ]

    return (<Modal cancel={cancel} >
        {toast.map((cur, i) => <Toast key={cur + i}> {cur}</Toast>)}
        <div className="invite no-interaction" >
            <nav className="navbar sticky-top shadow-sm navbar-light bg-white navbar-expand" >
                <button onClick={cancel} className="back-button" >
                    <i className="fa fa-arrow-left" />
                </button>
                <span className="ml-2 navbar-brand" >Invite Via Link</span>
                <div className="ml-auto" >
                    {loading && <div className="spinner-border" />}
                </div>
            </nav>

            <div className="Alert p-2 m-3 mb-0" >
                <p className="text-info" >
                    When enabled ,  Anyone on skychat can follow this link to join your group. Only share with people you truest
                </p>
                <ToggleSwitch
                    id={id + "_enableLink"}
                    checked={enabled}
                    width={100}
                    optionLabels={['Enabled', 'Disabled']}
                    onChange={val => setEnabled(val)}
                />
            </div>
            <div className="link-display ">
                <div className="link-icon">
                    <i className="fal fa-link" />
                </div>
                <a>{groupLink}</a>
            </div>

            <div className="buttons" >
                {buttons.map(cur => <button disabled={!enabled} key={cur.text} onClick={cur.action}>
                    <i className={"fa fa-" + cur.icon} />
                    <span>{cur.text}</span>
                </button>)}
            </div>
        </div>
        <style jsx>{`
      
        .invite {
            position : relative;
            height : 100vh;
            width : 100vw;
            overflow : auto;
            background : var(--light)
        }
        .link-display {
            display : flex;
             padding : 20px;
             margin : 0 10px;
             border-bottom : 1px solid var(--gray);
             align-items : center
    }
    .Alert {
        font-size : 12px;
    }
    .link-display a {
        color : #2af;
        word-break : break-all;
        font-size : 14px;
        font-weight : 400
    }
    .link-icon {
        background : #F80;
        border-radius : 50%;
        height : 50px;
        width : 50px;
        display : flex;
        flex-shrink : 0;
        align-items : center;
        justify-content : center;
        color : #fff;
        margin-right : 10px;
    }
        .buttons {
            padding : 0 15px ;
        }
          .buttons > * {
              width : 100%;
              display : flex;
              align-items : center;
              text=align : left;
              padding : 10px;
              margin : 10px 0;
              background : none;
              text-transform : capitalize;
          }
          .buttons > *:active {
              background : var(--white);
          }
          .buttons  i {
              color :${enabled ? '#f30' : '#fa9'} ;
              font-size : 20px;
              margin-right : 20px;
          } 
          @media (min-width : 1200px) {
              .invite {
                  height : 70vh;
                  top : 10vh;
                  width : 25rem;
                  border-radius : 15px;
                  box-shadow : 0 5px 15px #0004;
              }
          }
        `}</style>
    </Modal>
    )
}

export default GroupInvite
