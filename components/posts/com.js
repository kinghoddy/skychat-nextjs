import React from 'react'
import ProfilePicture from '../UI/profilePicture';
import Link from 'next/link';
import formatLink from '../formatLink';
import date from '../date'
import Comment from '../forms/comment';
const Com = (props) => {
    const [showCom, setShowCom] = React.useState(false)
    const [replies, setReplies] = React.useState([]);
    React.useEffect(() => {
        if (props.replies) {
            const r = []
            for (let key in props.replies) {
                r.push({
                    likes: [],
                    ...props.replies[key],
                    key
                })
            }
            setReplies(r)
        }
    }, [props.replies])
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
                    {Object.keys(props.likes).length > 0 && <span className="likes" >
                        {Object.keys(props.likes).length}
                        <i className="fa fa-heart ml-2" style={{ color: 'var(--red)' }} />
                    </span>}
                </div>
                <div className="small" >

                    <a onClick={props.like} href="#"   >Like</a>
                    <a href="#" onClick={e => {
                        e.preventDefault();
                        setShowCom(!showCom)
                    }}   >Reply</a>
                    {props.isMine && <a onClick={props.delete} className="" href='#'  >Delete</a>}
                    <span className=" date" >{date(props.date, true)}</span>
                </div>
                {replies.map(cur => <div className="reply" >
                    <Link href={props.userData.username} >
                        <a className="pl-2" >
                            <ProfilePicture size="25px" src={cur.userData.profilePicture} />
                        </a>
                    </Link>
                    <div className="comment" >
                        <div className="gray" >
                            <h4 >{cur.userData.username}</h4>
                            <div dangerouslySetInnerHTML={{ __html: formatLink(cur.comment) }} ></div>
                            {Object.keys(cur.likes).length > 0 && <span className="likes" >
                                {Object.keys(cur.likes).length}
                                <i className="fa fa-heart ml-2" style={{ color: 'var(--red)' }} />
                            </span>}
                        </div>
                        <div className="small" >

                            <a onClick={e => props.likeRep(cur)} href="#"   >Like</a>
                            <a href="#" onClick={e => {
                                e.preventDefault();
                                setShowCom(!showCom)
                            }}   >Reply</a>
                            {props.isMine && <a onClick={e => props.deleteRep(cur)} className="" href='#'  >Delete</a>}
                            <span className=" date" >{date(cur.date, true)}</span>
                        </div>
                    </div>
                </div>)}
                {showCom && <div className="com" >
                    <Comment initValue={'@' + props.userData.username + ' '} onBlur={() => null} focus={showCom} submit={props.reply} />
                </div>}
            </div>

            <style jsx>{`
                .con {
                    display : flex;
                    margin-bottom : 13px;
                }
                .comment {
                    margin-left : 10px;
                    flex : 1;
                }
                .gray {
                    background : var(--gray);   
                    border-radius : 15px;
                    position : relative;
                    padding : 5px 15px;
                    font-size : 14px;
                    line-height : 20px;
                    margin-right : 10px;
                    display : inline-block
                }
                .likes {
                    position : absolute ;
                    right :  -20px;
                    background : var(--light);
                    border-radius : 15px;
                    bottom : -5px;
                    padding : 0 5px
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
                    color : var(---black);
                }
                .date {
                    color : var(---dark);
                }
                .com {
                    flex : 1
                }
                .reply {
                     display : flex;
                     flex : 1;
                     margin-top : 10px
                }
            `}</style>
        </div>
    )
}
export default Com