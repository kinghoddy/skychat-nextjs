import React from 'react';
import Layout from '../../components/layouts/profile';

import MenuList from '../../components/menu/menuList';
import Toast from '../../components/UI/Toast/Toast';
import theme from '../../getTheme';
class Menu extends React.Component {
    state = {}
    render() {
        const Theme = props => <div className="theme" onClick={() => theme.setTheme(props.name)} >
            <span>{props.name}</span>
            <div className="dot" />
            <style jsx>{`
               .theme {
                   background : ${props.background};
                   color : ${props.light ? '#000' : '#fff'};
                   font-weight : 500;
                   font-size  : 18px;
                   padding : 15px 20px;
                   text-transform : capitalize;
                   display : flex;
                   align-items : center;
                   cursor : pointer;
                   border 2px solid var(--secondary);
                   justify-content : space-between;
                   border-radius : 10px;
                   margin-bottom : 10px;
               }
               .dot {
                   border-radius : 50%;
                   height : 30px;
                   width : 30px;
                   position : relative;
                   border : #fa0 solid 3px;
                }
                .dot::after {
                    background : #f80;
                   content : '';
                   position : absolute;
                   top : 50%;
                   left : 50%;
                   transform : translate(-50% , -50%);
                   border-radius : 50%;
                   height : 70%;
                   width : 70%;
               }
            `}</style>
        </div>
        return <Layout title="Display Settings | Skychat" active="display" >
            {this.state.toast && <Toast>{this.state.toast}</Toast>}

            <div className="row no-gutters py-2 px-3" >
                <div className="col-lg-5 d-none d-lg-block" >
                    <MenuList />
                </div>
                <div className="col" >
                    <div className="con" >
                        <h4>Theme</h4>
                        <Theme name="light" background="#f7f7f7" light />
                        <Theme name="dim" background="#234" />
                        <Theme name="dark" background="#222" />
                    </div>
                </div>
            </div>
            <style jsx>{`
      .con {
          background : var(--white);
          padding : 15px;
      }
                
            `}</style>
        </Layout>
    }
}
export default Menu