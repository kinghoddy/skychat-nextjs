import React from 'react'
import ProfilePicture from '../UI/profilePicture';
import Link from 'next/link';
import formatLink from '../formatLink';
import date from '../date'
const Com = (props) => {
    return (
        <div className='con'>
            <Link href={props.userData.username} >
                <a>
                    <ProfilePicture size="30px" src={props.userData.profilePicture} />
                </a>
            </Link>
            <div className="comment" >
                <div className="gray" >
                    <h4 >{props.userData.username}</h4>
                    <div dangerouslySetInnerHTML={{ __html: formatLink(props.comment) }} ></div>
                </div>
                <div className="small" >
                    <a onClick={props.like}   >Like</a>
                    <a onClick={props.reply}   >Reply</a>
                    {props.isMine && <a onClick={props.delete} className="" href='#'  >Delete</a>}
                    <span className=" date" >{date(props.date, true)}</span>
                </div>
            </div>
            <style jsx>{`
                .con {
                    display : flex;
                    margin-bottom : 13px;
                }
                .comment {
                    margin-left : 10px;
                }
                .gray {
                    background : var(--gray);   
                    border-radius : 15px;
                    padding : 5px 15px;
                    font-size : 14px;
                    line-height : 20px;
                    display : inline-block
                }
                .gray h4 {
                    font-size: 13px;
                    margin-bottom : 3px;
                    font-weight : 700
                }
                   .small {
                    font-size : 12px;
                    display : flex;
                    margin-top : 5px
                }
                
                .small > * {
                    padding : 0 5px;
                    color : #000;
                }
                .date {
                    color : #0009;
                }
            `}</style>
        </div>
    )
}
export default Com