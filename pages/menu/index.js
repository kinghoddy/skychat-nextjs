import React from 'react';
import Layout from '../../components/layouts/profile';
import firebase from '../../firebase';
import 'firebase/auth'
import MenuList from '../../components/menu/menuList';
import Router from 'next/router';
class Menu extends React.Component {
    state = {

    }
    componentDidMount() {
        if (window.innerWidth > 900) {
            Router.push('/menu/edit-profile')
        }
    }
    render() {
        return <Layout title="Menu | Skychat" >
            <div className="row no-gutters" >
                <div className="col-lg-5 mx-auto" >
                    <MenuList />
                </div>

            </div>
            <style jsx>{`
                     .row {
                    background : #e7e7e7;
                    min-height : calc(100vh - 4rem);
                }   
            `}</style>
        </Layout>
    }
}
export default Menu