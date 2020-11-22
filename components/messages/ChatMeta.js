import React from 'react'

function ChatMeta(props) {
    return (
        <div className="fetched" >
            {props.image && <img src={props.image} alt="" />}
            <div className="content">
                {props.title && <h6>{props.title.substr(0, 40)}</h6>}
                {props.description && <p>{props.description.substr(0, 80)}</p>}
            </div>
            <style jsx>{`
               .fetched {
                   background : #7774;
                   border-radius : 10px;
                   overflow : hidden;
                   display : flex;
                   flex-direction : column;
               }
               .content {
                   padding : 5px;
               }
               .content > * {
                   margin : 0;
                   line-height : 1.2;
               }
               .content h6 {
                   color : var(--dark);
                   font-size : 12px;
               }
               .content p {
                   color : var(--gray-dark);
                   padding-top : 3px;
                   font-size : 12px;
               }
               .fetched img {
                   max-width : 100%;
                   min-width : 6rem;
                   align-self : stretch;
                    height : 8rem;
                   object-fit : cover;
                   object-position : center;
               }
            `}</style>
        </div>
    )
}

export default ChatMeta
