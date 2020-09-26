import React from 'react';
import Img from '../UI/img/img';
import Video from './video_small';
import Link from 'next/link';
const Media = props => {
    const show = (i) => {
        props.show(true)
    }
    return <div className="row no-gutters" >
        {props.sources.map((cur, i) => {
            return i < 4 && <div key={cur.src} className={"col" + (i > 0 ? '-6' : '') + (i % 2 ? ' even' : ' odd')} >
                <a className="image" >
                    {props.sources.length > 4 && i === 3 && <div className="plus" >
                        + <span className="ml-2" >{props.sources.length - 4}</span>
                    </div>}
                    <div className="type" >
                        <i className={'fa fa-' + cur.type} />
                    </div>

                    {cur.type === 'image' ? <Img isFeed={props.sources.length === 1 ? true : false} onClick={show} maxHeight="80vh" alt="" src={cur.src} /> : <Video show={show} style={{ objectFit: props.sources.length > 1 ? 'cover' : 'contain' }} freeze={props.freeze} src={cur.src} />}
                </a>
            </div>
        })}
        <style jsx>{`
        .even {
            padding-bottom : 4px;
            padding-left : ${props.sources.length > 1 ? '2px' : '0'} ;

        }
        .odd {
            padding-bottom : 4px;
            padding-right : ${props.sources.length > 1 ? '2px' : '0'} ;
        }
      
               .image {
                   height : ${props.sources.length === 2 ? '20rem' : props.sources.length > 2 ? '10rem' : 'auto'};
                   width : 100%;
                   display : block;
                   background : var(--secondary);
                   cursor : pointer;
                   position : relative;
               }
               .plus {
                   position : absolute ;
                   top : 0;
                   left : 0;
                   height : 100%;
                   width : 100%;
                   background : #0005;
                   align-items : center;
                   display : flex;
                   justify-content : center;
                   font-size : 30px;
                   color : #fff;
                   z-index : 600
               }
               .type {
                   position : absolute ;
                   background : #0005;
                   top : 10px;
                   right : 10px;
                   height : 30px;
                   width : 30px;
                   display : flex;
                   justify-content : center;
                   align-items : center;
                   z-index : 500;
                   border-radius : 50%;
               }
               .type i {
                   font-size : 13px;
                   color : #fff;
               }
               .image video {
                   height : 100%;
                   width : 100%;
                   object-fit : cover
               }
        `}</style>
    </div>
}

export default Media