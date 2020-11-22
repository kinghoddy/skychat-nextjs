import React from 'react';
import Img from './img/img'
const ProfilePicture = props => {
  return <div className="profilePicture">
    {props.src && <div className="rounded-circle h-100 w-100 overflow-hidden" > <Img spinner={props.spinner ? false : true} alt="" src={props.src} /></div>}
    {props.online && <span className="online" ></span>}
    <style jsx>{`
          .profilePicture {
              border-radius : 50%;
              height : ${props.size};
              width : ${props.size};
              position: relative;
            flex-shrink : 0;
              background : #f7f8fc;
              ${!props.noBorder && `  border : 2px solid ${props.borderColor || '#e20'};`}
            
          }
          .online {
              height : calc(${props.size} / 3 ); 
              width : calc(${props.size} / 3 );
              max-height : 20px;
              max-width : 20px;
              position: absolute;
              bottom : 0;
              left : 70%;
              border-radius: 50%;
              border: 2px solid #fff;
              background : #3f3;
          }
        `}</style>
  </div>
}

export default ProfilePicture