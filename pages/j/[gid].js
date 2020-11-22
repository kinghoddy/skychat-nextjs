import React, { Component } from 'react';
import Layout from '../../components/layouts/profile'
import firebase from '../../firebase';
import 'firebase/database'
import FetchGroup from '../../components/messages/group/FetchGroup';
import Router from 'next/router';

export default class GroupInvite extends Component {

    render() {
        const res = {
            name: '',
            ...this.props.data.metadata
        }
        return (
            <Layout src={res.icon} title={`${res.name} | Skychat`} body={` ${res.description} | Groups on skychat`} >
                <div className="d-flex con justify-content-center" >
                    <i className="icon fad fa-users text-warning" />
                    <h2>Groups</h2>
                    <div>
                        <span>Group Invite Link</span>
                        <div className="link" >
                            {res.deepLink}
                        </div>
                    </div>
                </div>
                <FetchGroup
                    fetched={this.props.data}
                    cancel={() => Router.push('/feed')}
                    id={this.props.data.uniqueId}
                />
                <style jsx>{`
                  .con {
                      flex-direction : column;
                      align-items : center;
                      padding : 4rem 2rem;
                      text-align : center;
                  }
                  .icon {
                      font-size : 8rem;
                  }
                  .link {
                      background : var(--secondary);
                      border-radius : 10px;
                      padding : 3px 10px;
                      color : var(--primary)
                  }
                `}</style>
            </Layout>
        )
    }
}

export async function getServerSideProps({ query }) {
    const req = await firebase.database().ref('groupDeepLinks').orderByChild('uniqueId').equalTo(query.gid).once('value');
    const res = await req.toJSON();
    let data = {}
    for (let keys in res) data = {
        ...res[keys],
        id: keys
    }

    return { props: { data, key: query.gid } }
}