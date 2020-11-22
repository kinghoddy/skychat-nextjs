import React from 'react';
import firebase from '../../firebase';
import 'firebase/auth'
import Link from '../UI/Link/link';
import Messenger from '../UI/messenger';
import ProfilePicture from '../UI/profilePicture';
const MenuList = props => {
    const [userData, setUserData] = React.useState({})
    React.useEffect(() => {
        const ud = localStorage.getItem('skychatUserData');
        if (ud) setUserData(JSON.parse(ud))
    }, [])
    const logOut = () => {
        firebase
            .auth()
            .signOut().then(() => {
                localStorage.clear()
            })
    };
    return <div className=" sticky " >
        <nav className="navbar py-0" >
            <h3 className="navbar-brand mb-0 " >Menu</h3>
        </nav>
        <div className="px-3 py-2" >

            <Link activeClassName="active" href="/messages" >
                <a className="list" >
                    <img src="/img/logo/logo_blue.png" className="mr-3" />
                    <Messenger fontSize="11px" />
                </a>
            </Link>
            <Link activeClassName="active" href="/[profile]" as={"/" + userData.username} >
                <a className="list" >
                    <ProfilePicture src={userData.profilePicture} size="26px" online />
                    <span>Your Profile</span>
                </a>
            </Link>
            <Link activeClassName="active" href="/menu/edit-profile" >
                <a className="list" >
                    <i className="fal fa-edit text-primary " />
                    <span>Edit Profile</span>
                </a>
            </Link>
            <Link activeClassName="active" href="/menu/display" >
                <a className="list" >
                    <i className="fal fa-sun text-warning " />
                    <span>Display Settings</span>
                </a>
            </Link>
            <Link activeClassName="active" href="/privacy" >
                <a className="list" >
                    <i className="fal fa-user-secret text-success " />
                    <span>Privacy Policy</span>
                </a>
            </Link>
            <button className="list" onClick={logOut} >
                <i className="fal fa-sign-out text-danger " />
                <span>Log Out</span>
            </button>
        </div>
        <style jsx>{`
 
          .list {
              padding : 13px 15px ;
              display : flex;
              width: 100%;
              color : var(--gray-dark);
              margin-bottom : 10px;
              box-shadow : 0 2px 5px #0002;
              border-radius : 7px;
              background : var(--white);
              transition : all .3s;
              align-items : center;
              font-size : 15px;
              font-weight : 600
          }
          .list:hover ,
        .active {
            background : #fed9;
        }
          .list i {
              font-size : 23px;
          }
          .list img {
              height : 28px;
          }
          .list span {
              margin-left  : 12px
          }
 
        @media (min-width : 1200px) {
                             .sticky {
                position : sticky ;
                top : 4rem;
            }
    
        }
        `}</style>
    </div>

}

export default MenuList