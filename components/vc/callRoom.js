import React, { useEffect, useState, useCallback, useRef } from 'react'
import DailyIframe from '@daily-co/daily-js';
import api from './api';
import Call from './call/call';
import firebase from '../../firebase';
import 'firebase/database';

import Calling from './ring';
import Ringing from './ringing'
import { useRouter } from 'next/router';
import date from '../date';

const VcChatroom = props => {
    const [roomUrl, setRoomUrl] = useState(null);
    const [callObject, setCallObject] = useState(null);
    const [callKey, setCallKey] = useState(null);
    const [callState, setCallState] = useState(null);
    const [initParts, setInitParts] = useState(null)
    const [time, setTime] = useState(0)
    const play = useRef();
    const router = useRouter()
    useEffect(() => {
        if (!callObject) return;
        const events = ["joined-meeting", "left-meeting", "error"];
        function handleNewMeetingState(event) {
            switch (callObject.meetingState()) {
                case "left-meeting":
                    callObject.destroy().then(() => {
                        setRoomUrl(null);
                        setCallState('ended')
                        setCallObject(null);
                    });
                    break;
                case "joined-meeting":
                    setInitParts(event.participants)
                    break;
                case "error":
                    // setAppState('error');
                    break;
                default:
                    break;
            }
        }

        // Use initial state
        handleNewMeetingState();

        // Listen for changes in state
        for (const event of events) {
            callObject.on(event, handleNewMeetingState);
        }

        // Stop listening for changes in state
        return function cleanup() {
            for (const event of events) {
                callObject.off(event, handleNewMeetingState);
            }
        };
    }, [callObject]);
    //    updating url
    useEffect(() => {
        let t = time;
        var int = setInterval(() => {
            t++
            if (t > 50) clearInterval(int)
            setTime(t);
        }, 1000);
    }, [])
    // Call not answered
    useEffect(() => {
        if (time > 50) {
            const shouldCut = ['calling', 'ringing'].includes(callState)
            if (shouldCut) {
                console.log(callState);
                play.current.src = '/audio/call/busy.mp3';

                props.setToast('Call not answered')
                setTimeout(() => {
                    startLeavingCall()
                }, 3000);
            }
        }
    }, [callState, time]);
    //    before pop state ;
    useEffect(() => {
        window.location.hash = '#call'
        router.beforePopState(cb => {
            play.current.src = '/audio/call/busy.mp3';
            props.setToast('call Ended')
            setTimeout(() => {
                startLeavingCall();
                return false
            }, 3000)
        })
        // return () => startLeavingCall();
    }, [callObject]);
    useEffect(() => {
        if (props.roomUrl) {
            const newCallObject = DailyIframe.createCallObject();
            newCallObject.join({ url: props.roomUrl });
            setCallObject(newCallObject)
            setRoomUrl(props.roomUrl)
            const ref = firebase.database().ref('calls/' + props.callRef + '/callState');
            ref.once('value', s => {
                if (s.val()) {
                    setCallState('ringing');
                    play.current.src = '/audio/call/ring.mp3';
                    if (s.val() === 'calling') ref.set('ringing');
                } else startLeavingCall()
            })
            // startJoiningCall(props.roomUrl)
        } else createCall().then(url => startJoiningCall(url))
    }, [props.roomUrl, props.callRef, props.callState]);


    const createCall = useCallback(() => {

        return api
            .createRoom()
            .then(room => room.url)
            .catch(error => {
                setRoomUrl(null);
            });
    }, []);
    const startJoiningCall = url => {
        const newCallObject = DailyIframe.createCallObject();
        // update component state to a "joining" state...
        const myRef = firebase.database().ref('users/' + props.userData.uid + '/calling');
        const ref = firebase.database().ref('users/' + props.receiver.uid + '/calling');
        const callRef = firebase.database().ref('calls').push().key;
        myRef.set({
            roomUrl: url,
            isMine: true
        });
        ref.once('value', s => {
            if (s.val()) {
                props.setToast('User is on another call');
                setCallState('ended');
                play.current.src = '/audio/call/busy.mp3';
                setTimeout(() => {
                    startLeavingCall()
                }, 3000);
            } else {
                setCallKey(callRef)
                play.current.src = '/audio/call/calling.m4a';
                ref.set({
                    caller: props.userData,
                    callRef,
                    type: props.type,
                    roomUrl: url
                });
                firebase.database().ref('calls/' + callRef).set({
                    initiator: props.userData,
                    callState: 'calling'
                });
                setCallState('calling')
                newCallObject.join({ url });
                setRoomUrl(url);
                setCallObject(newCallObject)
            }
        });
    };

    const pickCall = () => {

        play.current.src = null;
        setCallState('inCall');
        firebase.database().ref('calls/' + callKey + '/callState').set('inCall');
    }
    React.useEffect(() => {
        let ref = callKey || props.callRef
        if (ref && ref !== undefined) {
            if (callKey !== ref) setCallKey(ref);
            firebase.database().ref('calls/' + ref).on('value', s => {
                if (s.val()) {
                    setCallState(s.val().callState);
                    (s.val().callState == 'inCall' && (play.current.src = null))
                } else {
                    setCallState('ended');
                    props.setToast('Call Ended');
                    setTimeout(() => (
                        startLeavingCall(true)
                    ), 2000)
                }
            });
        }
        return () => firebase.database().ref('calls/' + ref).off();
    }, [callKey, props.callRef, callState, callObject])
    const startLeavingCall = (hasCalled) => {
        let ple;
        if (callObject) {
            ple = Object.keys(callObject.participants()).length < 2;
        }
        const shouldCut = ['calling', 'ringing'].includes(callState)
        if (shouldCut || ple) {
            firebase.database().ref('calls/' + callKey).set(null);
            const r = firebase.database().ref('users/' + props.receiver.uid + '/calling')
            r.once('value', s => {
                if (s.val()) {
                    if (s.val().callRef === callKey) r.remove()
                }
            });
        }
        const d = {
            date: Date.now(),
            sender: 'skychat',
            seen: {
                [props.userData.uid]: Date.now()
            },
            message: '<i class="fa fa-video mr-2" style="color:#f22a" ></i> You missed a video call ' + date(Date.now(), true)
        }
        let chatId = props.userData.uid + '&' + props.receiver.uid;
        if (props.receiver.uid > props.userData.uid) {
            chatId = props.receiver.uid + '&' + props.userData.uid
        }
        if (shouldCut && !hasCalled && !props.roomUrl) {
            firebase.database().ref('chats/' + chatId + '/chats').push(d)
            console.log(d);
        }
        firebase.database().ref('users/' + props.userData.uid + '/calling').set(null);

        props.close();
        if (!callObject) return;
        callObject.leave();
    }
    return (
        <div className="videoCon">
            {callState === 'inCall' ? (
                <Call initParts={initParts} roomUrl={roomUrl} leave={startLeavingCall} type={props.type} callObject={callObject} />
            ) : (props.roomUrl ? <Ringing caller={props.caller} type={props.type} pickCall={pickCall} leave={startLeavingCall} /> : <Calling callState={callState} receiver={props.receiver} type={props.type} leave={startLeavingCall} />
                )}
            <audio autoPlay loop ref={play} />
            <style jsx>{`
              .videoCon {
                  background-color: #222;
                  position: relative;
                  height: 100%;
                  width: 100%;
                }

            `}</style>
        </div>
    )
}

export default VcChatroom