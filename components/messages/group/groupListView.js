import React, { useState } from 'react'
import Search from '../../forms/search'
import CreateGroup from './CreateGroup';
import GList from './GList';
import firebase from '../../../firebase';
import 'firebase/database'
import Link from 'next/link';
import Spinner from '../../UI/Spinner/Spinner';

class GroupsLisView extends React.Component {
    state = {
        groups: [],
        userData: {},
        loading: false,
        showNewGroup: false
    }

    componentDidMount() {
        const ud = JSON.parse(localStorage.getItem('skychatUserData'))
        if (ud) {
            this.setState({ userData: ud })
            this.getGroups(ud.uid);
        }
    }

    getGroups = (uid) => {
        const initChats = localStorage.getItem('skychatGroups')
        if (initChats) this.setState({ groups: JSON.parse(initChats) });
        const db = firebase.database();
        this.setState({ loading: true })
        var ref = db.ref("users/" + uid + "/groups");
        ref.on("value", s => {
            let chatArr = [];
            let chatsId = s.val();
            if (chatsId) {
                chatArr = Object.keys(chatsId);
                const chatsRef = firebase.database().ref('groups');
                const chats = [];
                chatArr.forEach(cur => {
                    chatsRef.child(cur + '/metadata').once('value', snapshot => {
                        chatsRef.child(cur + '/chats/').limitToLast(1).on('value', snap => {
                            chats.forEach((current, i) => {
                                if (current.id === cur) {
                                    chats.splice(i, 1);
                                }
                            });
                            console.log(s.val());
                            for (let key in snap.val()) {
                                const di = document.createElement('div');
                                di.innerHTML = snap.val()[key].message;
                                chats.push({
                                    seen: {},
                                    metadata: snapshot.val(),
                                    ...snap.val()[key],
                                    message: di.textContent,
                                    id: cur,
                                });

                                if (chats.length === chatArr.length) {
                                    setTimeout(() => {
                                        this.setState({ loading: false, groups: chats })
                                        localStorage.setItem('skychatGroups', JSON.stringify(chats))
                                    }, 500);
                                }
                            }
                        })
                    })

                })
            } else {
                this.setState({ loading: false, groups: [] })
            }
        });
    }
    render() {
        return (
            <div className="con" >
                { this.state.showNewGroup && <CreateGroup uid={this.props.uid} cancel={() => this.setState({ showNewGroup: false })} />}
                <nav id="groupNav" className=" px-3 py-1 navbar  navbar-light   navbar-expand" >
                    <div className="navbar-brand  " >
                        <h4 className="mb-0 ml-2 text-capitalize" >Groups</h4>
                        {this.state.loading && <div className="spinner">
                            <Spinner fontSize="2px" />
                        </div>}

                    </div>
                    <div className="collapse navbar-collapse" >
                        <ul className="navbar-nav ml-auto" >

                            <li className="nav-item" >
                                <button onClick={() => this.setState({ showNewGroup: true })} className="nav-link" >
                                    <i className="fa fa-plus mr-1" />
                                    <span className="pr-2" >New Group</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </nav>

                <Search />
                {
                    !this.state.loading && this.state.groups.length === 0 && <div className="text-center" >
                        <p>No groups yet</p>
                        <button onClick={() => this.setState({ showNewGroup: false })} className="rounded-pill btn btn-fav" >
                            <i className="fal fa-users-medical mr-2" />
                    Create a group</button>
                    </div>
                }
                { this.state.groups.map(cur => <GList key={cur.id} {...cur} />)}
                <style jsx >{`
                    .navbar-brand {
                    display : flex;
                    align-items : center;
                }
                .navbar-brand small {
                    font-weight : 600;
                    color : var(--gray-dark)
                }
                .spinner {
                    height : 20px;
                    width : 20px;
                    margin : 0 10px;
                }
                .nav-item {
                    margin : 0 5px;
                }
                .nav-link {
                    background : var(--light);
                    height : 40px;
                    padding : 0;
                    display : flex;
                    align-items : center;
                    justify-content : center;
                    min-width : 40px;
                    color : var(--black);
                    border-radius : 20rem;
                }
           
            `}</style>
            </div >
        )
    }
}

export default GroupsLisView
