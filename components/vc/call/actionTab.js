import React, { useState } from 'react'

export default function CallActionTabs(props) {
    const [videoMuted, setVideoMuted] = useState(false)
    const [audioMuted, setAudioMuted] = useState(false);
    const [useFlash, setUseFlash] = useState(false)
    React.useEffect(() => {
        console.log(props.participants);
    }, [props.participants])
    const switchCam = () => {
        if (props.callObject) {
            props.callObject.cycleCamera()
        }
    }
    const switchMic = () => {
        if (props.callObject) {
            props.callObject.cycleMic()
        }
    }
    const toggleVideo = () => {
        let callObject = props.callObject
        if (callObject) {
            callObject.setLocalVideo(videoMuted)
            setVideoMuted(!videoMuted)
        }
    }
    const toggleMic = () => {
        let callObject = props.callObject
        if (callObject) {
            callObject.setLocalAudio(audioMuted)
            setAudioMuted(!audioMuted)
        }
    }
    const toggleFlash = () => {
        let callObject = props.callObject
        if (callObject) {
            let track = callObject.participants().local.videoTrack;
            if (track) track.applyConstraints({
                advanced: [{ torch: !useFlash }]
            });
            if (track) setUseFlash(!useFlash)
        }
    }
    return (
        <React.Fragment>
            <button onClick={props.leave} className="fadeInDown animated faster hangup" style={{ background: '#f21' }} >
                <i className="material-icons" >call_end</i>
            </button>

            <div className="callTabs animated fadeIn" >
                <div className="button btnIn" style={{ animationDelay: '1.5s' }}>
                    <button onClick={switchCam}  >
                        <i className="fad fa-camera" />
                    </button>
                    <p>Switch</p>
                </div>
                {/* <div className="button btnIn" onClick={switchMic} style={{ animationDelay: '2s' }} >
                    <button  >
                        <i className="fad fa-microphone-stand" />
                    </button>
                    <p>switch</p>
                </div> */}
                {props.type === 'video' && <div className="btnIn button" style={{ animationDelay: '2.5s' }}>
                    <button onClick={toggleVideo} className={videoMuted ? 'muted' : ''} >
                        <i className={"fad fa-video" + (videoMuted ? '-slash' : '')} />
                    </button>
                    <p>{videoMuted ? 'Unmute' : 'Mute'}</p>
                </div>}
                <div className="button btnIn" style={{ animationDelay: '3s' }} >
                    <button onClick={toggleMic} className={audioMuted ? 'muted' : ''} >
                        <i className={"fad fa-microphone" + (audioMuted ? '-slash' : '')} />
                    </button>
                    <p>{audioMuted ? 'Unmute' : 'Mute'}</p>
                </div>
                <div className="button btnIn" style={{ animationDelay: '3.5s' }}>
                    <button onClick={toggleFlash}  >
                        <i className={"fad fa-lightbulb-" + (useFlash ? 'on' : 'slash')} />
                    </button>
                    <p>Flash</p>
                </div>
            </div>
            <style jsx>{`
             .callTabs {
                   position : absolute;
                    bottom : 6%;
                    background : #000a;
                    justify-content : space-between;
                    overflow-x : auto;
                    overflow-y : hidden;
                    border-radius : 20px;
                    padding : 20px;
                    display : flex;
                    z-index : 100;
                    width : calc(100% - 30px);
                    left : 15px;
                    text-align : center;
             }
             .hangup {
                 position : absolute ;
                 left : calc(50% - 25px);
                      display : flex;
                    align-items : center;
                    justify-content : center;
                    height : 55px;
                    width : 55px;
                    z-index : 600;
                    color : #fff;
                    bottom : calc( 10% + 100px );
                    border-radius : 50%;
                    box-shadow : 0 2px 5px #000c;
             }
             .button {
                 flex-shrink : 0;
                 padding : 0 5px;
             }
                .button p{
                    color : #fffa;
                    line-height : 1;
                    margin-bottom : 0px;
                    margin-top : 10px;
                    font-size : 12px;
                }
                .button button {
                    display : flex;
                    align-items : center;
                    justify-content : center;
                    color : #fff;
                    height : 45px;
                    width : 45px;
                    background : #fff3;
                    border-radius : 50%;
                }
                .button button.muted {
                    background : #eee;
                    color : #f21;
                }
                .button button i {
                    color : inherit;
                    font-size : 20px;
                }
               
            `}</style>

        </React.Fragment>
    )
}
