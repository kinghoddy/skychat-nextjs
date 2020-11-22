import React from 'react';
import ProfilePicture from '../UI/profilePicture';
import Img from '../UI/img/img'

export default function EntryRinging(props) {
    const video = React.useRef();
    React.useEffect(() => {
        let stream;
        if (video.current) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then((s) => {
                stream = s
                video.current.srcObject = stream;
            })
        }
        return () => {
            if (stream) stream.getTracks().forEach(function (track) {
                track.stop();
            });
        }
    }, [props.type])
    return (
        <div className="con woo fadeInUp faster" >
            {props.type === 'video' ? <video className="wow fadeIn video" playsInline autoPlay muted ref={video} /> : <div className="background">
                {props.caller && <Img src={props.caller.coverPhoto} />}
            </div>}
            {props.caller && <header>
                <ProfilePicture src={props.caller.profilePicture} online={props.caller.online} size="60px" />
                <div className="pl-3" >
                    <h4>{props.caller.fullName}</h4>
                    <h6>{props.caller.username}</h6>
                </div>
            </header>}
            <footer>

                <div className="button btnIn" >
                    <button onClick={() => props.leave()} style={{ background: '#f21' }} >
                        <i className="material-icons" >call_end</i>
                    </button>
                    <p>Hang Up</p>
                </div>
                {/* <div className="button" >
                    <button onClick={() => props.leave()} style={{ background: '#48c' }} >
                        <i className="fa fa-microphone" ></i>
                    </button>
                    <p>Mute</p>
                </div> */}
                <div className="button" >
                    <button onClick={props.pickCall} className="animated shake " style={{ background: '#3d4' }} >
                        <i className="fad  fa-phone-alt" />
                    </button>
                    <p>Accept</p>
                </div>
            </footer>
            <style jsx>{`
                .con {
                     height : 100%;
                    width : 100%;
                    position : relative;
                }
                .video {
                    position : absolute ;
                    top : 0;
                    object-fit : cover;
                    left : 0;
                    height : 100%;
                    width : 100%;
                }

                .background {
                    position : absolute ;
                    top : 0;
                    left : 0;
                    height : 100%;
                    width : 100%;
                    filter : blur(10px) brightness(50%);
                }
                header  { 
                    z-index : 100;
                    position : absolute;
                    top : 15%;
                    width : 100%;
                    display : flex;
                    align-items : center;
                    justify-content : center
                }
                footer {
                    position : absolute;
                    bottom : 10%;
                    background : #000a;
                    justify-content : space-between;
                    border-radius : 20px;
                    padding : 20px;
                    display : flex;
                    z-index : 100;
                    width : calc(100% - 30px);
                    left : 15px;
                    text-align : center;
                }             
                .button p{
                    color : #fffa;
                    line-height : 1;
                    margin-bottom : 0px;
                    margin-top : 10px;
                    font-size : 12px;
                }
                .shake {
                    animation-delay : 2s;
                    animation-iteration-count: 2;

                }
                .button button {
                    display : flex;
                    align-items : center;
                    justify-content : center;
                    height : 50px;
                    width : 50px;
                    border-radius : 50%;
                }
                .button {
                    display : flex;
                    align-items : center;
                    flex-direction : column
                }
                .button button i {
                    color : #fff;
                    line-height : 1;
                    font-size : 25px;
                }
                header h4 , header h6 {
                    color : #fff !important;
                    margin : 0;
                }
        
            `}</style>
        </div>
    )
}
