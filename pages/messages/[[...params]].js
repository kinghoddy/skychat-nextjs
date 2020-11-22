import React from 'react';
import Layout from '../../components/layouts/messages';
import GroupRoom from '../../components/messages/group/grouproom';
import Chatroom from '../../components/messages/chatroom';


export default class Messages extends React.Component {
    static async getInitialProps({ query }) {
        return { query }
    }
    state = {
        params: null,
        chatting: false,
        chatId: null,
        extraView: null,
        type: null
    }
    componentDidUpdate() {
        if (this.props.query.params !== this.state.params) {
            this.setState({ params: this.props.query.params })
            this.checkChatting()
        }
    }
    componentDidMount() {
        this.checkChatting()
    }
    checkChatting = () => {
        let params = this.props.query.params || [];
        if (params[1]) {
            this.setState({ chatting: true, type: params[0], chatId: params[1], extraView: params[2] })
        } else {
            this.setState({ chatting: false })
        }
    }
    render() {
        return <Layout chatting={this.state.chatting} title="Messages | Skychat Messenger" >
            {this.state.chatting ? <React.Fragment>
                {this.state.type === 'g' ? <GroupRoom
                    key={this.state.chatId}
                    id={this.state.chatId}
                    extraView={this.state.extraView}
                /> : <Chatroom
                        key={this.state.chatId}
                        id={this.state.chatId}
                    />}
            </React.Fragment> : <div className="con" >
                    <div className="text-center text-light" >
                        <img src="/img/logo/skychat_light_2.png" className="logo" />
                        <h1 className="mb-0 h5 mt-3" >Click on a chat to display</h1>
                    </div>
                </div>}
            <style jsx >{`
               .con {
                   height : 100%;
                   width : 100%;
                   background : #f61a;
                   display : flex;
                   align-items: center;
                   justify-content : center;
                   border-bottom : 6px solid  #f21;
               }
               .logo {
                   width : 10rem;
                   max-width : 80%
               }
               .con > * {
                   background : #f207;
                   height : 20rem;
                   width : 20rem;
                   justify-content : center;
                    display : flex;
                    flex-direction : column;
                    border-radius : 50%;
                    padding :30px;
                   align-items: center;
               }
            `}</style>
        </Layout>
    }
}