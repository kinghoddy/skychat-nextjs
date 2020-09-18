import Link from 'next/link'
import React from 'react'
import play from '../Audio/Audio'
import date from '../date'

export default function NotPanel(props) {
    const [show, setShow] = React.useState(true);
    const [playing, setPlaying] = React.useState(false)
    const cancel = () => {
        setShow(false);
    }
    React.useEffect(() => {
        if (!playing) {
            play('notification');
            setPlaying(true)
        }
        setTimeout(() => {
            cancel()
        }, 6000)
    }, [])
    return (
        <div className="con" >
            {props.icon && <img className="icon" src={props.icon} />}
            <div className="pl-3 pan" >
                {props.href && <Link href={props.href} onClick={cancel}>
                    <a className="stretched-link"></a>
                </Link>}

                <h6 className="title" >{props.title}
                </h6>
                <p className="text" dangerouslySetInnerHTML={{ __html: props.text.substring(0, 30) + '...' }}></p>
                <span className="date" >{date(props.date, true)}</span>
                {props.buttons && <div className="buttons" >
                    {props.buttons.map(cur => <button className="btn btn-primary" >{cur.text}</button>)}
                </div>}
            </div>
            <i className="fa fa-bell" />
            <i className="cancel fal fa-times" onClick={cancel} />
            <style jsx>{`
            @keyframes in {
                0% {
                    margin-left : -10rem;
                    opacity : 0;
                    visibility : hidden;
                }
                100% {
                    margin-left : 0;
                    opacity : 1;
                    visibility : visible
                }
            }
            @keyframes out {
            0% {
                 margin-left : 0;
                 opacity : 1;
                 visibility : visible
                }
                100% {
                    margin-left : -10rem;
                    visibility : hidden;
                    opacity : 0;
                }
            }
               .con {
                   background : var(--white);
                   border-radius : 3px;
                   box-shadow : 0 5px 10px #0003;
                   position : fixed;
                   left : 50%;
                   top : 10px;
                   animation : in in 1s ;
                   z-index : 1250;
                   width : 90%;
                   transform : translateX(-50%);
                   margin-left : ${show ? '0' : '-10rem'};
                   opacity : ${show ? '1' : 0};
                   visibility : ${show ? 'visible' : 'hidden'};
                   transition : all 1s;
                   padding : 10px;
                   display : flex;
               }
               .icon {
                   height : 50px;
                   width : 50px;
                   border-radius : 50%;
                   border : 1px solid #777;
               }
               .pan {
                   flex : 1;
                   position : relative
               }
               .title {
                   text-transform : capitalize;
                   margin-bottom : 0;
                   display : flex;
               }
               .date {
                   text-transform : lowercase;
                   color : #0005;
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
                   .cancel {
                       color : #f219;
                       margin-left : 10px;
                       cursor : pointer
                   }

               .buttons {
                   display : flex;

                   justify-content : space-around
               }
               @media (min-width : 1200px) {
                   .con {
                       left : 20px;
                       top : unset;
                       bottom : 30px;
                       width : 30vw;
                       transform : none
                   }
               }
            `}</style>
        </div>
    )
}
