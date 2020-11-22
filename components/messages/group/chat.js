import React from 'react';
import ProfilePicture from '../../UI/profilePicture';
import date from '../../date';
import FlipMove from 'react-flip-move'
import formatLink from '../../formatLink'
class Chat extends React.Component {
    state = {
        senderObj: {},
        userData: {}
    }

    componentDidMount() {
        const ud = JSON.parse(localStorage.getItem('skychatUserData'))
        if (ud) this.setState({ userData: ud });
        this.checkInvite()
    }
    componentDidUpdate() {
        if (this.props.senderObj) if (this.props.senderObj !== this.state.senderObj) this.setState({ senderObj: this.props.senderObj })
    }
    checkInvite() {
        let message = this.props.message || ''
        // var links = message.match("<a>(.*?)</a>");
        // console.log(links);
        console.log(message);

    }
    render() {
        let classes = 'received';
        if (this.props.sender === 'skychat') classes = "skychat"
        if (this.props.sender === 'time') classes = "time";
        if (this.props.sender === this.state.userData.uid) classes = 'sent';
        // const seen = this.props.seen && this.props.seen[this.props.receiver.uid];
        return (


            <div className={"con " + classes} >
                {this.props.showImg && <div className="icon" >
                    <ProfilePicture online={this.state.senderObj.online} size="35px" src={this.state.senderObj.profilePicture} />
                </div>}
                <div className="message" >
                    {/* {seen && <div className="tick" >
                        <i className="fas fa-check-circle" />
                    </div>} */}
                    <div className="name">{this.state.senderObj.username}</div>
                    <article className="article" dangerouslySetInnerHTML={{ __html: this.props.sender === 'time' ? date(this.props.message) : formatLink(this.props.sender === 'skychat' ? this.props.message.replace('' + this.props.userData.username, ' You') : this.props.message) }} ></article>
                </div>
                <style jsx>{`
                   .con {
                       display :flex;
                       width : 100%;
                       align-items : flex-end;
                   }
                   .message  {
                       margin-bottom : 0;
                       flex-shrink : 0;
                       position : relative;
                       max-width : 80%;
                    }
                    .article {
                        font-size: 14px;
                        font-weight: 500;
                        line-height: 1.3;
                        position : relative;
                        white-space : pre-wrap;
                        overflow-wrap : break-word;
                        padding: 8px 12px;         
                        display : inline-block;
                        max-width : 100%;
                   }
                   .name {
                          color : var(--gray-dark);
                          padding : 5px;
                          font-size : 12px;
                          display : none;
                      }
                      .received .name {
                          display : flex;
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
       
                   .skychat {
                       margin : 10px 0;
                   }
                   .skychat .message {
                       background: #fda0;
                       margin: 0 auto;
                       text-align: center;
                      border-radius: 15px;
                 
                   }
                   .skychat .article {
                     font-size : 12px;
                       color: var(--dark);
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
                      text-transform : uppercase;
                   
                      white-space : nowrap;
                      border-radius: 20px;
                       text-align: center;
                      background: none;
                    }
                    .time .article {
                       font-size : 11px;
                      font-weight : 600;
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
                       margin-right: auto;
                       margin-left : 12px;
                     }
                     .received .message>article {
                       color: var(--dark);
                       background: var(--white);
                      border-radius: 8px 15px 15px 8px;
                     }
                      
                   .sent .message{
                     margin-right : 10px;
                     margin-left: auto;
                   }
                   .sent .article {
                     border-radius: 15px 8px 8px 15px ;
                     background: #fc9;
                     color: #111;
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
                        body.dark  .received .article {
                       background: #444 !important;
                       color : #fff !important
                     }
                      body.dark .sent .article {
                           background: #643 !important;
                           color : #fff !important;
                      }
                      body.dim .sent .article {
                           background: #643 !important;
                           color : #fff !important;
                      }
                        body.dim  .received .article {
                       background: #62686a !important;
                       color : #fff !important
                     }
                     .article a {
                         word-wrap : break-word !important;
                     }
                `}</style>
            </div>

        )
    }
}

export default Chat