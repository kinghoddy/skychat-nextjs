import React, { useCallback, useState } from 'react'
import Search from '../../forms/search';
import UserSelect from './userSelect';
import FlipMove from 'react-flip-move'
import ProfilePicture from '../../UI/profilePicture';
import LazyLoad, { forceCheck } from 'react-lazyload';
import firebase from '../../../firebase';
import 'firebase/database'

function AddParticipant({ members = {}, scrollContainer, uid, selected, setSelected }) {
    const [searching, setSearching] = useState(null)
    const [loading, setLoading] = useState(false);
    const [friends, setFriends] = useState([]);
    const [results, setResults] = useState([]);
    const [useableSelect, setUseableSelect] = useState([])
    // creating the selected array
    React.useEffect(() => {
        let s = []
        for (let key in selected) {
            s.push({
                ...selected[key],
                key
            })

        }
        s = s.sort((a, b) => a.selectId - b.selectId)
        setUseableSelect(s);
    }, [selected]);


    const selectHandler = (cur) => {
        const s = { ...selected }
        if (s[cur.key]) delete s[cur.key];
        else s[cur.key] = { ...cur, selectId: useableSelect.length + 1 }

        setSelected(s);
        setTimeout(() => {
            document.querySelector('.selected_flip').scrollLeft = 100000
        }, 700)
    }
    const removeUser = (cur) => {
        const s = { ...selected }
        if (s[cur.key]) delete s[cur.key];
        setSelected(s)
    }
    React.useEffect(() => {
        setTimeout(() => {

            forceCheck()
        }, 1000)
    }, [friends, results])

    const searchUser = (query) => {
        setSearching(query)
        firebase.database().ref('users').orderByChild('username').startAt(query.toLowerCase()).endAt(query.toLowerCase() + "\uf8ff").once('value', s => {
            const res = [];
            for (let key in s.val()) {
                const u = {
                    username: s.val()[key].username,
                    profilePicture: s.val()[key].profilePicture,
                    connections: s.val()[key].connections,
                    fullName: s.val()[key].fullName,
                    key
                }
                res.push(u)
            }
            setResults(res)
            setSearching(null);
        })
    }
    // creating the recent chats array
    React.useEffect(() => {
        const initChats = JSON.parse(localStorage.getItem('skychatMessages'));
        if (initChats) {
            let f = initChats.sort((a, b) => b.date - a.date).map(cur => {
                let d = {}
                for (let id in cur.metadata) {
                    if (id !== uid) {
                        let u = JSON.parse(localStorage.getItem('chat=' + id));

                        d = { ...cur.metadata[id], key: id }
                        if (u) d = {
                            profilePicture: u.icon,
                            username: u.chatHead,
                            fullName: u.fullName,
                            key: id
                        }

                    }
                }
                return d
            });
            setFriends(f);
        };

    }, []);

    return (
        <React.Fragment>
            <Search onSubmit={searchUser} />
            {searching && <div className="d-flex align-items-center justify-content-center" >
                <div className="spinner spinner-grow text-dark mr-2" />
                <span>
                    Searching for "{searching}"
                    </span>
            </div>}

            <FlipMove>
                {results.map(cur => <LazyLoad scrollContainer={scrollContainer}
                    offset={100} height={200} key={cur.key}>
                    <UserSelect
                        exists={members[cur.key]}
                        select={() => selectHandler(cur)}
                        selected={selected[cur.key] ? true : false}
                        {...cur} />
                </LazyLoad>)}

            </FlipMove>
            <h5 className="segment-header" >Recent Chats</h5>
            <FlipMove
                appearAnimation="elevator"
            >
                {friends.map((cur, i) => <LazyLoad
                    scrollContainer={scrollContainer}
                    height={200} key={cur.key}>
                    <UserSelect
                        chats
                        exists={members[cur.key]}
                        uid={uid}
                        select={() => selectHandler(cur)}
                        selected={selected[cur.key] ? true : false}
                        {...cur}
                    />
                </LazyLoad>
                )}
            </FlipMove>
            <div id="createGroup_watch" className="text-center py-2" >
                {loading && <div className="spinner spinner-border" />}
            </div>
            {useableSelect.length > 0 && <div className="selected animated fadeInUp faster" >
                <div className="d-flex align-items-center justify-content-between px-2 pb-2" >
                    <h6 className="mb-0" >
                        {useableSelect.length} Selected
                    </h6>
                    <button onClick={() => setSelected({})} className="selected_clear " >Clear all</button>
                </div>
                <FlipMove
                    className="selected_flip"
                    staggerDelayBy={150}
                >
                    {useableSelect.map(cur => <div className="selected_flip_child" key={cur.key} >
                        <button onClick={() => removeUser(cur)} className="selected_cancel" >
                            <i className="fal fa-times" />
                        </button>
                        <ProfilePicture src={cur.profilePicture} size="50px" online={cur.connections} />
                        <p>{cur.username}</p>
                    </div>)}
                </FlipMove>
            </div>}
            <style jsx>{`
                .selected {
                    position : sticky;
                    bottom : 0rem;
                    padding-top 10px;
                    z-index : 1;
                    background : var(--white);
                    box-shadow : 0 -3px 5px #0005;
                }
       .selected_clear {
           background : var(--primary);
           color : #fff;
           text-transform : uppercase;
           padding : 5px 10px;
           font-size : 12px;
           border-radius : 3px;
       }
                .selected_flip_child {
                    flex-shrink : 0;
                    padding : 10px; 
                    display : flex;
                    flex-direction : column;
                    justify-content : center;

                    align-items : center;
                    position : relative;
                }
                .selected_cancel {
                    position : absolute ;
                    top : 5px;
                    z-index : 1;
                    border : 1px solid var(--gray-dark);
                    background : var(--secondary);
                    right : 10%;
                    border-radius : 50%;
                    font-size : 10px;
                }
                .selected p {
                    font-size : 12px;
                    margin-bottom : 0;
                }
                .segment-header {
                    padding : 15px;
                }
            
            `}</style>
            <style jsx global>{`
                      .selected_flip {
                      display : flex;
                      scroll-behaviour : smooth;
                    overflow : auto;
                }
            `}</style>
        </React.Fragment>
    )
}

export default AddParticipant
