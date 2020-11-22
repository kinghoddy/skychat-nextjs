import React, { forwardRef } from 'react'
import ProfilePicture from '../../UI/profilePicture'

function UserSelect(props, ref) {
    const select = () => {
        if (props.exists) {

        } else props.select();
    }

    return (

        <div className='user' onClick={select} ref={ref} >
            <ProfilePicture noBorder src={props.profilePicture} online={props.connections} size="55px"
            />
            <div className="user_menu" >
                <p>
                    <span>{props.username}</span>
                    {props.exists && <small className="member" >Member</small>}
                </p>
                <h6>{props.fullName}</h6>
            </div>
            {!props.exists && <i className={`radio ml-auto fa${props.selected ? 'd' : 'l'} fa-circle`} />}
            <style jsx>{`
              .user {
                  display : flex;
                  transition : all .3s;
                  padding : 10px 15px;
                  align-items : center;
                  cursor : ${props.exists ? 'not-allowed' : 'pointer'} ;
                  opacity : ${props.exists ? '.7' : 1}
              }
              .user_menu {
                    margin : 0 10px;
                    flex : 1;
              }
              .user_menu > * {
                  margin : 0;
              }
              .member {
                  color : #f90;
                  border : 1px solid #f90;
                  border-radius : 3px;
                  margin-left : auto;
                  display : block;
                  text-transform : uppercase;
                  font-size : 9px;
                  padding : 4px 5px 
              }
              .user_menu p {
                  color : var(--gray-dark);
                  line-height : 1;
                  margin-top -2px;
                  display : flex;
              }
              .user_menu h6 {
                  text-transform : capitalize;
              }
              .radio {
                  color : ${props.selected ? 'var(--primary)' : 'var(--dark)'}
              }

            `}</style>
        </div>
    )
}

export default forwardRef(UserSelect)
