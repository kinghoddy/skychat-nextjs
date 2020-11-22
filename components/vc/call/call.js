import React, { useState } from 'react'
import Spinner from '../../UI/Spinner/Spinner';
import CallActionTabs from './actionTab';
import Tile from './tile';
export default function Call(props) {
    const [tiles, setTiles] = useState([])
    const [loading, setLoading] = useState(false)
    React.useEffect(() => {
        let callObject = props.callObject;
        if (!callObject) return;
        const events = [
            "participant-joined",
            "participant-updated",
            "participant-left"
        ];
        function handleNewParticipantsState(event) {
            let p = callObject.participants();
            createTiles(p);
            switch (event.action) {
                case 'participant-joined':
                    setLoading(false)
                    break;
                case 'participant-left':
                    let ple = Object.keys(p).length;
                    if (ple === 1) props.leave()
                    break
                default:
                    break
            }
        }
        // Listen for changes in state
        for (const event of events) {
            callObject.on(event, handleNewParticipantsState);
        }
        // Stop listening for changes in state
        return function cleanup() {
            for (const event of events) {
                callObject.off(event, handleNewParticipantsState);
            }
        };
    }, [props.callObject]);
    React.useEffect(() => {
        let p = props.initParts;
        if (p) {
            createTiles(p)
            let ple = Object.keys(p).length;
            if (ple < 2) setLoading(true);
            else setLoading(false);
        } else setLoading(true);
    }, [props.initParts]);
    React.useEffect(() => {
        const handleCall = event => {
            // Cancel the event as stated by the standard.
            event.preventDefault();
            // Older browsers supported custom message
            event.returnValue = 'You are currently in a call';
        }
        window.addEventListener('beforeunload', handleCall, false);
        return () => window.removeEventListener('beforeunload', handleCall, false)
    })

    const createTiles = (participants) => {
        console.log(participants);
        let patsArr = [];
        for (let key in participants) {
            const tile = {
                ...participants[key],
                key
            }
            patsArr.push(tile)
        };
        setTiles([...patsArr])
    }

    return (
        <div className="con" >

            {loading && <div className="spinner" > <audio autoPlay loop src="/audio/call/connecting.mp3" ></audio> <Spinner fontSize="3px" /></div>}
            {tiles.map((cur) => {
                let i = tiles.length
                return i === 1 ? <Tile {...cur} /> : i === 2 ? (cur.key === 'local' ? <div className="animated slideInRight delay-1s local" >
                    <Tile {...cur} />
                </div> : <Tile {...cur} />) : <div className="column" > <Tile {...cur} /> </div>
            })}
            <CallActionTabs type={props.type} callObject={props.callObject} leave={props.leave} />
            <style jsx>{`
              .con {
                  height : 100%;
                  display : flex;
                  flex-wrap : wrap;
                  position : relative;
              }
              .spinner {
                  position : absolute ;
                  top : 45%;
                  z-index : 100;
                  left : 50%;
                  transform : translateX(-50%);
              }
              .column {
                width : 50%;
                  height : 50%;
              }
              .local {
                  position : absolute;
                  top : 10px;
                  right : 10px;
                  height : 190px;
                  width : 130px;
                  box-shadow : 0 8px 15px #000a;
                  max-width : 35%;
                  max-height : 35%;
                  z-index : 200;
                  overflow : hidden;
                  border-radius : 15px;
              }
            `}</style>
        </div>
    )
}
