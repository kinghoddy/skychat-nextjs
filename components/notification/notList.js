
import React from 'react'
import Link from 'next/link'
import date from '../date'

const NotList = (props) => {
    return (
        <div className="cons" >
            {props.icon && <img className="icon" src={props.icon} alt="" onError={e => e.target.src = '/img/avatar-red.png'} />}
            <div className="pl-3 pan" >
                {props.link && <Link href={props.link} >
                    <a onClick={props.cancel} className="stretched-link"></a>
                </Link>}

                <div className="title" dangerouslySetInnerHTML={{ __html: props.title }} >
                </div>

                <span className="date" >{date(props.date, true)}</span>
                {props.buttons && <div className="buttons" >
                    {props.buttons.map(cur => <button className="btn btn-primary" >{cur.text}</button>)}
                </div>}
            </div>
            <i className="fa fa-bell" />

            <style jsx>{`
               .cons {
                   background : ${props.seen ? 'var(--white)' : 'var(--gray)'};
                   border-radius : 3px;
                   padding : 10px;
                   position : relative;
                   display : flex;
               }



               .icon {
                   height : 50px;
                   outline-color : #000;
                   width : 50px;
                   object-fit : cover;
                   text-indent : 10000px;
                   border-radius : 50%;
                   border : 1px solid #777;
               }
               .pan {
                   flex : 1;
                   position : relative
               }
               .title {
                   white-space : pre-wrap;
                   margin-bottom : 0;
                   line-height : 1.2;
               }
               .date {
                   text-transform : lowercase;
                   color : var(--gray-dark);
                   font-weight : 600;
                   display : block;
                   font-size : 12px;
               }
               .text {
                   margin-bottom : 0;
                   }
                   .fa-bell {
                       color : #7777;
                   }
      

               .buttons {
                   display : flex;

                   justify-content : space-around
               }
               @media (min-width : 1200px) {
             
               }
            `}</style>

        </div>
    )
}
export default NotList