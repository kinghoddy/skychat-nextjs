import React, { Component } from 'react'
import firebase from '../../firebase';
import 'firebase/database';
import AddUser from './addUser';
import Spinner from '../UI/Spinner/Spinner';
export default class MayKnow extends Component {
    state = {
        sug: [],
        userData: {}
    }
    constructor(props) {
        super(props)
        this.row = React.createRef()
    }
    componentDidMount() {
        let ud = JSON.parse(localStorage.getItem('skychatUserData'))
        if (ud) {
            this.setState({ userData: ud })
            this.loadData(ud.uid)
        }
        let initSug = JSON.parse(localStorage.getItem('skychatFriendsSug'));
        if (initSug) this.setState({ sug: initSug })
    }
    loadData = (uid) => {
        firebase.database().ref('users/' + uid + '/friendsId').limitToLast(100).once('value', s => {
            let friends = [];
            if (s.val()) {
                this.setState({ loading: true })
                friends = Object.values(s.val())
                const sug = [];
                friends.forEach((cur, index) => {
                    let fof = [];

                    firebase.database().ref('users/' + cur + '/friendsId').limitToLast(10).once('value', snap => {

                        if (snap.val()) {

                            for (let key in snap.val()) {
                                if (snap.val()[key] !== uid && friends.indexOf(snap.val()[key]) === -1) {

                                    fof.push(snap.val()[key])
                                }
                            };
                            fof.forEach((current) => {
                                firebase.database().ref('users/' + current).once('value', sn => {
                                    let d = {
                                        username: sn.val().username,
                                        fullName: sn.val().fullName,
                                        uid: current,
                                        src: sn.val().profilePicture,
                                        online: sn.val().connections
                                    }

                                    sug.forEach((c, i) => {
                                        if (c.username === d.username) {
                                            sug.splice(i, 1)
                                        }
                                    })
                                    let req = sn.val().requestsId || {};
                                    if (!req[uid]) sug.push(d);
                                    setTimeout(() => {

                                        let sd = sug.reverse()
                                        localStorage.setItem('skychatFriendsSug', JSON.stringify(sd))
                                        this.setState({ sug: sd, loading: false })
                                    }, 2000)
                                })
                            })
                        }
                    });
                })
            } else this.setState({ loading: false })
        })
    }
    move = dir => {
        let row = this.row.current;
        if (row) {
            console.log(row.scrollX, row.scrollLeft);
            if (dir) row.scrollLeft += 300;
            else row.scrollLeft -= 300;
        }
    }
    render() {
        return (this.state.sug.length > 0 ?
            <div className="con">
                <h6 className="border-bottom p-3 d-flex align-items-center" >
                    <i className="fal fa-user-friends mr-2" />
                    <span> People You May Know</span>
                    {this.state.loading && <div className="ml-auto" >
                        <Spinner fontSize='2px' />
                    </div>}
                </h6>
                <div className="r no-gutters" ref={this.row} >
                    {this.state.sug.map((cur, i) => <div key={cur.username} className="snap col-8 col-lg-7 px-1" >
                        <AddUser {...cur} userData={this.state.userData} />
                    </div>)}

                </div>
                {this.state.sug.length > 1 && <button className="right left" onClick={() => this.move(false)} >
                    <i className="fal fa-arrow-left" />
                </button>}
                {this.state.sug.length > 1 && <button className="right" onClick={() => this.move(true)} >
                    <i className="fal fa-arrow-right" />
                </button>}
                <style jsx>{`
                   .con {
                  padding : 20px;
            box-shadow: 0 0px 3px 2px #0001;
                  position : relative;

            background : var(--white);
              }
              .r {
                  display : flex;
                  overflow : auto ;
                  scroll-behavior  : smooth;
                  scroll-snap-type: X mandatory;
                  padding-bottom : 10px;
              }
              .snap {
                    scroll-snap-align: center;
              }
              .r::-webkit-scrollbar {
                  height : 1px;
              }
              .right {
                   position : absolute ;
                   top : calc(50% - 25px);
                   right : 0px;
                   height : 50px;
                   width : 50px;
                   color : var(--black);
                   border-radius : 50%;
                   box-shadow : 0 3px 15px #0008;
                   background : var(--gray);
              }
              .left {
                  left : 0;
                  right : unset
              }
            `}</style>
            </div> : null
        )
    }
}
