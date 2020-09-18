import React from 'react';
import ProfilePicture from './profilePicture';
import Link from 'next/link'

const UserList = props => {
    const [friends, setFriends] = React.useState(0)
    return <div className="py-3 d-flex border-bottom position-relative" key={props.key}>
        <Link href="/[profile]" as={"/" + props.username} >
            <a className="stretched-link" >
                <ProfilePicture online={props.connections} size={props.small ? '40px' : "60px"} src={props.profilePicture} />
            </a>
        </Link>
        <div className="pl-3" >
            <h5 className="name mb-0 text-capitalize" >{props.fullName}</h5>
            <span className="mb-0 " >{props.username}</span>
            <span className="info " >
                <i className="fa fa-user-friends mr-2" />
                {friends} Friends</span>
            {props.info && <React.Fragment>
                {props.info.bio && <span className="info " > <i className="fal mr-2 fa-info-circle" />
                    {props.info.bio.substring(0, 30)}...</span>}
                {props.info.address && <span className="info " > <i className="fa fa-location mr-2" />
                    {props.info.address}</span>}
            </React.Fragment>}
        </div>
        <style jsx>{`
         .info {
             display : block;
             color : #0007;
             font-weight : 600;
             font-size : ${props.small ? '13px' : 'unset'}
         }

           .name {
               font-size : ${props.small ? '15px' : '20px'}
           }
        
        `}</style>
    </div>
}

export default UserList