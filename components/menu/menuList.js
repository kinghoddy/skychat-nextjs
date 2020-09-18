import React from 'react';
import firebase from '../../firebase';
import 'firebase/auth'
import Link from '../UI/Link/link';
const MenuList = props => {
    const logOut = () => {
        firebase
            .auth()
            .signOut()
    };
    return <div className=" sticky " >
        <nav className="navbar sticky-top py-0" >
            <h3 className="navbar-brand mb-0 " >Menu</h3>
        </nav>
        <div className="px-3 py-2" >

            <Link activeClassName="active" href="/menu/edit-profile" >
                <a className="list" >
                    <i className="fal fa-edit text-primary " />
                    <span>Edit Profile</span>
                </a>
            </Link>
            <Link activeClassName="active" href="#" >
                <a className="list" >
                    <i className="fal fa-sun text-warning " />
                    <span>Display Settings</span>
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
              color : #777;
              margin-bottom : 10px;
              box-shadow : 0 2px 5px #0002;
              border-radius : 7px;
              background : var(--white);
              transition : all .3s;
              align-items : center;
              font-size : 15px;
          }
          .list:hover ,
        .active {
            background : #fed;
        }
          .list i {
              font-size : 23px;
              margin-right : 12px;
          }
          .sticky-top {
              background : #e7e7e7;
              top : 3rem
          } 
        @media (min-width : 1200px) {
                             .sticky {
                position : sticky ;
                top : 4rem;
            }
                 .sticky-top {
              top : 4rem
          } 
        }
        `}</style>
    </div>

}

export default MenuList