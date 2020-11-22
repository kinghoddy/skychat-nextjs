import React from 'react';
import ProfilePicture from '../UI/profilePicture';
import date from '../date';
import FlipMove from 'react-flip-move'
import formatLink from '../formatLink';
import { fetchMetaData, getIvLinks } from '../getLinks';
import ChatMeta from './ChatMeta';

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.message = React.createRef()
    }
    state = {
        receiver: {},
        fetched: null,
        groupLink: null
    }
    componentDidUpdate() {
        if (this.props.receiver.uid !== this.state.receiver.uid) {
            this.setState({ receiver: { ...this.props.receiver } })
        }
    }
    checkLinks = async () => {
        const s = getIvLinks(this.message.current);
        this.setState({ groupLink: s })
        const meta = await fetchMetaData(this.message.current);
        this.setState({ fetched: meta })
    }
    componentDidMount() {
        this.setState({ receiver: this.props.receiver });
        this.checkLinks()
    }
    render() {
        let classes = 'sent';
        if (this.props.sender === 'skychat') classes = "skychat"
        if (this.props.sender === 'time') classes = "time"
        if (this.props.sender === this.props.receiver.uid) classes = "received";
        const seen = this.props.seen && this.props.seen[this.props.receiver.uid];
        return (


            <div className={"con " + classes} >
                {this.props.showImg && <div className="icon" >
                    <ProfilePicture online={this.props.receiver.online} size="35px" src={this.props.receiver.profilePicture} />
                </div>}
                <div className="message" >
                    {this.state.fetched && <ChatMeta {...this.state.fetched} />}
                    {seen && <div className="tick" >
                        <i className="fas fa-check-circle" />
                    </div>}
                    <article ref={this.message} dangerouslySetInnerHTML={{ __html: this.props.sender === 'time' ? date(this.props.message) : formatLink(this.props.message || '') }} ></article>
                    {this.state.groupLink && <button className="group" >View Group</button>}
                </div>
                <style jsx>{`
                   .con {
                       display :flex;
                       align-items : flex-end;
                   }
                   .message {
                      font-size: 14px;
                      font-weight: 500;
                      position : relative;
                      padding: 8px 12px;
                      line-height: 1.3;
                      margin-bottom : 0;
                      max-width : 80%;
                      display : flex;
                      flex-direction : column;
                      flex-shrink : 0;
                      white-space : pre-wrap;
                      overflow-wrap : break-word;
                   }
                   .group {
                       width : 100%;
                       background : #7773;
                       padding : 5px;
                       color : var(--info);
                       margin-top : 10px;
                       border-radius : 5px;
                       transition : background .5s;
                   }
                   .group:active {
                       background : var(--fav);
                       color : #fff;
                   }
                
                   .tick {
                       position : absolute ;
                       left : 10px;
                       top : -7px;
                       display : none;
                       color : #fa0;
                   }
                   .tick i {
                       font-size : 12px;
                   }
                   .received .tick {
                       right : 10px;
                       left : unset
                   }
                   .sent .tick {display : block}
                   .message article {
                       width : 100%;
                   }
                   .skychat {
                       margin : 10px 0;
                   }
                   .skychat .message {
                       background: rgba(255, 236, 184, 0.5);
                       margin: 0 auto;
                       text-align: center;
                      border-radius: 15px;
                       font-size : 12px;
                       color: black;
                   }
                   .received , .sent {
                       margin-bottom : ${this.props.showImg ? '20px' : '2px'}
                   }
                   .received {
                       padding-left : ${this.props.showImg ? '0' : '35px'}
                   }
             
                .time .message {
                    margin: 10px auto;
                      color: var(--gray-dark);
                      font-size : 12px;
                      white-space : nowrap;
                      text-transform : uppercase;
                      padding : 10px 15px;
                      border-radius: 20px;
                       text-align: center;
                    }
                 .received .message::after , .sent .message::after {
                     content : '';
                     height : 10px;
                     width : 10px;
                     position : absolute ;
                     border-radius : 50px 0 0 50% ;
                     clip-path : polygon(0 70% , 100% 0 ,100% 100% , 0 70%);
                     bottom : 10px;
                     left : -10px;
                     display: ${this.props.showImg ? 'block' : 'none'};
                     background: inherit;
                                     }
                    .sent .message::after {
                        left : unset;
                        transform : rotateY(180deg);
                           right : -10px;
                    }
                    .received .message {
                       background: var(--white);
                       color: var(--dark);
                       margin-right: auto;
                      border-radius: 8px 15px 15px 8px;
                       margin-left : 12px;
                     }
           
                   .sent .message{
                     background: #fc9;
                     border-radius: 15px 8px 8px 15px ;
                     color: #111;
                     margin-right : 10px;
                     margin-left: auto;
                   }
                   .skychat .icon , .time .icon , .sent .icon {
                       display : none;
                   }
                   @media (min-width : 1200px) {
                       .received .message{
                       margin-left : 15px;
                     }
                   }

                `}</style>
                <style jsx global>{`
                              body.dark .sent .message {
                           background: #643 !important;
                           color : #fff !important;
                      }
                      body.dim .sent .message {
                           background: #643 !important;
                           color : #fff !important;
                      }
                      .message a {
                         word-wrap : break-word !important;
                     }
                `}</style>
            </div>

        )
    }
}

export default Chat