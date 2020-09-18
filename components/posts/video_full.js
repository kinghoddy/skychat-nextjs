import React, { useState } from 'react';
const VideoPost = props => {

    const video = React.useRef();
    const [play, setPlay] = useState(false)
    const [muted, setMuted] = useState(false)

    const watchScroll = () => {
        if (video.current) {
            if (!props.freeze) {
                const vidtop = video.current.getBoundingClientRect().top;
                if (vidtop < 300 && vidtop > 0) {
                    video.current.play()
                    setPlay(true)
                } else {
                    video.current.pause()
                    setPlay(false)
                }
            }
            video.current.onended = e => {
                setPlay(false)
            }
        }
    }
    React.useEffect(() => {
        watchScroll();
        window.addEventListener('scroll', watchScroll)
        return function cleanUp() {
            window.removeEventListener('scroll', watchScroll)
        }
    }, []);
    const muteUnmute = () => {
        if (video.current.muted) {
            video.current.muted = false
            setMuted(false)
        } else {
            video.current.muted = true
            setMuted(true)

        }
    };
    const playPause = () => {
        if (video.current.paused || video.current.ended) {
            video.current.play();
            setPlay(true)
        } else {
            video.current.pause();
            setPlay(false)
        }
    };

    return <div className="con" >
        <video style={{ ...props.style }} ref={video} src={props.src} controls ></video>
        {/* <div className="controls">
            <button onClick={playPause}>
                <i className={"fal fa-" + (play ? 'pause' : 'play')} />
            </button>
            <button onClick={muteUnmute}>
                <i className={"fal fa-volume-" + (muted ? 'mute' : 'up')} />
            </button>
        </div> */}
        <style jsx>
            {`
            .con {
                position : relative;
                height : 100%;
            }
            video {
                height : 100%;
                max-height : 70vh;
                width : 100%;
                object-fit : contain;
                display : block;
                background: #000;
            }
            .controls {
                position: absolute;
                z-index : 100;
                bottom : 0;
                left : 0;
                width : 100%;
                padding : 6px;
                display : flex;
                justify-content : space-between;
            }
            .controls button {
                background : #0005;
                border-radius : 50%;
                width: 30px;
                height: 30px;
                display : flex;
                align-items : center;
                justify-content : center;
                font-size : 10px;
                color : #fff;
            }
            `} </style>
    </div>
}
export default VideoPost