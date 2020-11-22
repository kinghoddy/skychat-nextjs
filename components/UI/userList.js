import React from 'react';
import ProfilePicture from './profilePicture';
import Link from 'next/link'

const UserList = props => {
    const [friends, setFriends] = React.useState(0)
    React.useEffect(() => {
        let f = 0
        if (props.friendsId) {
            for (let keys in props.friendsId) {
                f++
            }
            setFriends(f)
        }
    }, [props.friendsId])
    return <div className="userList d-flex border-bottom position-relative" key={props.key}>
        <Link href="/[profile]" as={"/" + props.username} >
            <a className="stretched-link" >
                <ProfilePicture online={props.connections} size={props.small ? '40px' : "60px"} src={props.profilePicture} />
            </a>
        </Link>
        <div className="pl-3" >
            <span className="mb-0 username" >{props.username}</span>
            <h6 className="name mb-0 text-capitalize" >{props.fullName}</h6>
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
        .userList {
            padding : 10px;
        }
         .info {
             display : block;
             color : var(--gray-dark);
             font-weight : 600;
             font-size : 12px}
         }

           .name {
               font-size : 14px;
               font-weight : 700;
           }
           .username {
                  font-size : 14px;
               font-weight : 700;
               color : var(--gray-dark)
           }
        
        `}</style>
    </div>
}

export default UserList