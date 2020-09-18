import React from 'react';
import Layout from '../../../components/layouts/messages';
import Chatroom from '../../../components/messages/chatroom';

export default class Messages extends React.Component {
    static async getInitialProps({ query }) {
        return { query }
    }
    render() {
        return <Layout chatting title={" | Skychat Messenger"} >
            <Chatroom id={this.props.query.chatId} key={this.props.query.chatId} />
        </Layout>
    }
}