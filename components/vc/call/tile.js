import React, { useRef, useState, useEffect } from 'react'

export default function Tile(props) {
    const video = useRef();
    const audio = useRef();
    const [loading, setLoading] = useState(true)
    React.useEffect(() => {
        if (video.current) {
            if (props.video) {
                let stream = new MediaStream([props.videoTrack])
                video.current.srcObject = stream
                video.current.addEventListener('play', e => {
                    setLoading(false)
                })
                video.current.addEventListener('stop', e => {
                    setLoading(true)
                });
            }
        }
    }, [props.videoTrack])
    React.useEffect(() => {
        if (video.current) {
            if (props.video) video.current.play;
            else video.current.pause;
        }
    }, [props.video])
    React.useEffect(() => {
        if (audio.current) {
            if (props.audio) audio.current.play;
            else audio.current.pause;
        }
    }, [props.audio])
    useEffect(() => {
        audio.current && props.audio && !props.local &&
            (audio.current.srcObject = new MediaStream([props.audioTrack]));
    }, [props.audioTrack]);

    return (
        <div className="tile" >
            {loading && <div className="loader" >
                <div className="text-danger spinner-grow mr-2" /> Connecting
    </div>}
            <div className="title" >
                {!props.audio && <button>
                    <i className="fal fa-microphone-slash" />
                </button>}
                {!props.video && <button>
                    <i className="fal fa-video-slash" />
                </button>}
            </div>
            <video playsInline ref={video} autoPlay ></video>
            <audio ref={audio} autoPlay ></audio>
            <style jsx>{`
               .tile {
                   background : #333;
                   height : 100%;
                   width : 100%;
                   overflow : hidden;
                   position : relative
               }
               .loader {
                   z-index : 50;
                   position : absolute ;
                   height : 100%;
                   width : 100%;
                   display : flex;
                   align-items : center;
                   justify-content : center;
                   color : #fff
               }
               .title {
                   position : absolute;
                   left : 5px;
                   top : 5px;
                   display : flex;
               }
               .title button {
                   flex-shrink : 0;
                   height : 30px;
                   width : 30px;
                   display : flex;
                   align-items : center;
                   justify-content : center;
                   border-radius : 50%;
                   background : #0008;
               }
               .title button i {
                   color : #fff;
               }
               video {
                   width : 100%;
                   height : 100%;
                   object-fit : cover;
               }
            `}</style>
        </div>
    )
}
