import React from 'react';
import ProfilePicture from '../UI/profilePicture';
import Link from 'next/link';

export default class RequestUser extends React.Component {
    render() {
        return <div className="con" >
            <Link href={"/" + this.props.username} >
                <a>
                    <ProfilePicture size="45px" src={this.props.src} online={this.props.online} />
                </a>
            </Link>
            <div className="pl-2" >
                <h6 className="text-capitalize" >{this.props.username}
                    <small className="font-weight-light" > sent you a friend request</small>
                </h6>
                <div className="d-flex buttons justify-content-between" >
                    <button onClick={(e) => {
                        e.target.disabled = 'true';
                        this.props.confirmRequest({
                            username: this.props.username,
                            profilePicture: this.props.src,
                            uid: this.props.uid
                        });
                    }}
                        className="btn  btn-fav" >Confirm</button>
                    <button className="btn  btn-light" >Delete</button>
                </div>
            </div>

            <style jsx>{`
               .con {
                   display : flex;
               }
               .buttons button {
                   font-size : 10px;
                   width : 45%;
                   padding : 3px 10px;
               }
            `}</style>
        </div>
    }
}