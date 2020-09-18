import React from 'react';
import Layout from '../../components/layouts/messages';

export default class Messages extends React.Component {
    render() {
        return <Layout title="Messages | Skychat Messenger" >
            <div className="con" >
                <div className="text-center text-light" >
                    <img src="/img/logo/skychat_light_2.png" className="logo" />
                    <h1 className="mb-0 h5 mt-3" >Click on a chat to display</h1>
                </div>
            </div>
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