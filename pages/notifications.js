import React from 'react';
import Layout from '../components/layouts/profile'
import NotPage from '../components/notification/notPage';

export default class Nots extends React.Component {
    render() {
        return <Layout title="Notifications" notProps={this.props.notProps} >
            <div className="con py-lg-3" >
                <div className=" sh">

                    <NotPage />
                </div>
            </div >
            <style jsx>{`
              .con {
                  max-width : 30rem;
                  margin : 0 auto;
              }
              @media (min-width : 1200px){

                  .sh {
                     box-shadow : 0 5px 10px #0003; 
                }
            }
            `}</style>
        </Layout>
    }
}