import React from 'react';
import ProfilePicture from '../UI/profilePicture';
import date from '../date';
import formatLink from '../formatLink'
class Chat extends React.Component {
    state = {
        receiver: {}
    }
    componentDidUpdate() {
        if (this.props.receiver.uid !== this.state.receiver.uid) {
            this.setState({ receiver: { ...this.props.receiver } })
        }
    }
    componentDidMount() {
        this.setState({ receiver: this.props.receiver })
    }
    render() {
        let classes = 'sent';
        if (this.props.sender === 'skychat') classes = "skychat"
        if (this.props.sender === 'time') classes = "time"
        if (this.props.sender === this.props.receiver.uid) classes = "received";
        return (
            <div className={"con " + classes} >
                {this.props.showImg && <div className="icon" >
                    <ProfilePicture online={this.props.receiver.online} size="35px" src={this.props.receiver.profilePicture} />
                </div>}
                <div className="message" >

                    <article dangerouslySetInnerHTML={{ __html: this.props.sender === 'time' ? date(this.props.message) : formatLink(this.props.message) }} ></article>
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
                      word-wrap : break-word;
                      max-width : 80%;
                      display : flex;
                      flex-shrink : 0;
                      white-space : pre-line
                   }
                   .message article {
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
                      color: red;
                      font-size : 12px;
                      white-space : nowrap;
                      padding : 10px 15px;
                      border-radius: 20px;
                       text-align: center;
                      background: var(--white);
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
            </div>
        )
    }

}

export default Chat