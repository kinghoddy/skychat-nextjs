import React from 'react';
import firebase from '../../firebase';
import 'firebase/database';
import Spinner from '../UI/Spinner/Spinner';
import NotList from './notList'


export default class NotPage extends React.Component {
    state = {
        loading: false,
        nots: [],
        count: 10,
        newNot: [],
        userData: {}
    }
    componentDidMount() {
        const ud = JSON.parse(localStorage.getItem('skychatUserData'))

        if (ud) this.setState({ userData: ud });

        let initN = localStorage.getItem('skychatNots')
        if (initN) this.setState({ nots: JSON.parse(initN) })
        this.getNots(ud.uid);
        window.addEventListener('scroll', this.loadMore, false)
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.loadMore, false)
    }
    getNots = (uid) => {
        this.setState({ loading: true });
        firebase.database().ref('users/' + uid + '/notification').once('value', s => {
            let nots = [];
            let newNot = []
            for (let key in s.val()) {
                let d = {
                    ...s.val()[key],
                    key
                }
                nots.push(d)
            }
            localStorage.setItem('skychatNots', JSON.stringify(nots.reverse()))
            this.setState({ nots: nots, loading: false })
        })
    }
    cancel = id => {
        firebase.database().ref('users/' + this.state.userData.uid + '/notification/' + id + '/seen').set(Date.now())
    }
    loadMore = () => {
        let count = this.state.count;
        count += 3;
        const watch = document.getElementById('watch').getBoundingClientRect().top;
        if (watch < window.innerHeight) {
            if (count < this.state.nots.length) {
                this.setState({ count })
            }
        }
    }
    render() {

        return (
            <div className="con">
                <nav>
                    <h6 className=" h5 mb-0">Notifications</h6>
                    {this.state.loading && <div style={{ width: '4rem' }} >
                        <Spinner fontSize="2px" />
                    </div>}
                </nav>


                {this.state.nots.length > 0 && <div className="cat" >
                    {/* <div className="mb-2">  

                        <strong>
                            New
                    </strong>
                        <small>{this.state.nots.length}</small>
                    </div> */}
                    {this.state.nots.map((cur, i) => i < this.state.count && <NotList cancel={() => this.cancel(cur.key)} {...cur} />)}
                </div>}
                <div id="watch" className="p-3 text-center" >No more notifications</div>
                <style jsx>{`
                   .con {
                       background : var(--white);
                   }
                   nav {
                       padding : 15px;
                       display : flex;
                       justify-content : space-between;
                       position : sticky ;
                       top : 2.8rem;
                       z-index : 1000;
                       background : inherit;
                       border-bottom : 1px solid var(--gray);
                   }
                   .cat {
                        padding : 10px 0;
                   }
                   .cat strong {
                       padding : 0 15px;
                   }
                `}</style>
            </div>
        )
    }
}