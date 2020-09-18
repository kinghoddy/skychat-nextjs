import React from 'react';
import Img from './img/img'
import Link from 'next/link'
export default props => {
    return <div className="profilePicture">
        {props.src && <div className="img" > <Img alt="" src={props.src} /></div>}
        <div className={props.full ? 'px-3' : ''} >

            <h6 className="text-capitalize mb-0 mt-2 " >{props.fullName} </h6>
            <Link href="/[profile]" as={"/" + props.username}>
                <a className="name text-dark stretched-link"  >{props.username}</a>
            </Link>
            {props.info && <React.Fragment>
                {props.info.bio && <span className="info " > <i className="fal mr-2 fa-info-circle" />
                    {props.info.bio.substring(0, 30)}...</span>}
                {props.info.address && <span className="info " > <i className="fa fa-location mr-2" />
                    {props.info.address}</span>}
                {props.info.email && <span className="info " > <i className="fa fa-envelope mr-2" />
                    {props.info.email}</span>}
            </React.Fragment>}
        </div>
        {props.online && <span className="online" ></span>}
        <style jsx>{`
          .profilePicture {
              width : 100%;
              position: relative;
          }
                .info {
             display : block;
             color : #0007;
             font-weight : 600;
         }
         
          .img {
              background : #f7f8fc;
              height : ${props.full ? '150px' : '100px'};
              border: 1px solid #eee;
              border-radius : 10px;
              overflow : hidden
          }
          .name {
              text-transform : capitalize;
              font-size : 12px;
              font-family : "Architects Daughter", cursive;
              margin-top : 10px;
              margin-bottom : 0;
              
          }
          .online {
              height : 15px; 
              width : 15px;
              position: absolute;
              top : 5px;
              right : 5px;
              border-radius: 50%;
              border: 2px solid #fff;
              background : #3f3;
          }
        `}</style>
    </div>
} 