import React, { forwardRef, useState } from 'react'
import date from '../../date';
import Link from '../../UI/Link/link'
import ProfilePicture from '../../UI/profilePicture'
import firebase from '../../../firebase'
import 'firebase/database'


function GList(props, ref) {
    const [data, setData] = useState({})
    const [seen, setSeen] = useState(false);

    React.useEffect(() => {
        const ud = JSON.parse(localStorage.getItem('skychatUserData'))
        if (ud) getData(ud.uid);
    }, []);
    const getData = (uid) => {
        if (props.seen[uid]) setSeen(true);
        else setSeen(false);
        setData(props.metadata)
    }

    return <Link ref={ref} href="/messages/g/[...groupid]" as={"/messages/g/" + props.id} >
        <a className="con" >
            <ProfilePicture size="53px" src={data.icon} online={data.online} />
            <div className="ml-3" >
                <h6 className="mb-0"  >{data.groupName}</h6>
                {props.message.split && <p className="mb-0" >
                    <span className="text" dangerouslySetInnerHTML={{ __html: props.message.substring(0, 17) + (props.message.length > 17 ? '...' : '') }} ></span>
                    <b className="pl-2" >{date(props.date, true)} </b>
                </p>}
            </div>
            {!seen && <div className="dot" />}
            <style jsx>{`
              .con {
                  display : flex;
                  align-items : center;
                  background : var(--white);
                  margin : 10px 15px;
                  border-radius : 10px;
                  box-shadow : 0 3px 15px #0004;
                  padding : 7px  10px;
                }
                .con  * {
                    line-height: 1.3 !important;
              }
              .con:hover {
                  background: #f301;
              } 
              .con h6 {
                  font-weight : 700;
                  color :${seen ? 'var(--gray-dark)' : 'var(--black)'};
              }
              .con p {
                  color : ${seen ? 'var(--gray-dark)' : 'var(--black)'};
                  font-weight : ${seen ? '400' : 700};
                  font-size : 13px;
              }
              .con b {
                  color : var(--dark);
                  font-weight : 600;
                  font-size : 13px;
              }
              .text, .text *{
                  display : inline;
                  white-space : nowrap
              }
              .text br {
                  display : none
              }
              .dot {
                  height : 15px;
                  width : 15px;
                  margin-left : auto;
                  background : var(--fav);
                  border-radius : 50%
              }
            `}</style>
        </a>
    </Link>

}

export default forwardRef(GList)
