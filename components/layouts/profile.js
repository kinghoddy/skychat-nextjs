import React from 'react';
import Head from 'next/head';
import firebase from '../../firebase';
import 'firebase/auth';
import 'firebase/database';
import Ppicture from '../UI/profilePicture'
import Link from '../UI/Link/link';
import RouterLoader from '../UI/routerLoader';
import Router from 'next/router'
import Broken from '../broken';

class Profile extends React.Component {
    state = {
        userData: {
            username: '',
            profilePicture: ''
        },
        showSearch: false,
        isPhone: false,
        search: ''
    }
    componentDidMount() {
        this.loadUserData();
        if (window.innerWidth < 1200) {
            this.setState({ isPhone: true })
        } else {
            this.setState({ isPhone: false })
        }
        if (this.props.search) this.setState({ search: this.props.search, showSearch: true })

    }
    loadUserData = () => {
        this.setState({ loading: true });
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                localStorage.setItem("hasUsedSkychat", true);
                const updatedUd = {
                    username: user.displayName.toLowerCase(),
                    profilePicture: user.photoURL,
                    uid: user.uid,
                };
                localStorage.setItem("skychatUserData", JSON.stringify(updatedUd));
                // fetch the profile data
                this.setState({
                    userData: updatedUd,
                    loading: false,
                });
            } else {
                localStorage.removeItem('skychatUserData');
                localStorage.removeItem("skychatFeed");
                localStorage.removeItem("hasUsedSkychat");
                this.setState({ loggedOut: true });
                if (!this.props.stay) Router.push("/login");
            }
        });
    };
    cancelSearch = () => {
        this.setState({ showSearch: false })
        if (this.props.search) {
            Router.back();
        }
    }
    search = (e) => {
        e.preventDefault();
        Router.push('/search?q=' + this.state.search)
    }
    render() {
        return <div className="wrappers position-relative ">
            <Head>
                <title>{this.props.title || 'Join skychat today'}</title>
                <meta property="og:title" content={this.props.title || 'Join Skychat Today'} />
                <meta property="og:description" content={this.props.body || 'Join skychat today'} />
                <link rel="shortcut icon" href="/img/logo/logo_red.png" />
                <meta property="og:image" content={this.props.src ? this.props.src : "/img/logo/icon-512.png"} />
            </Head>
            <RouterLoader />
            <nav className="navbar fixed-top navbar-expand navbar-light bg-white" id="navTop">
                <div className="container">
                    <a href="#" className="navbar-brand logo">

                        <img alt="" src="/img/logo/skychat_light_1.png" className="dark_logo" />
                        <img alt="" src="/img/logo/skychat_red.png" className="light_logo" />
                    </a>
                    <div className="d-lg-none">
                        <div className=" phone collapse navbar-collapse "   >
                            <div className={"animated fast d-flex phoneSearch " + (this.state.showSearch ? 'slideInDown' : 'slideOutUp')} >
                                <button onClick={this.cancelSearch}>
                                    <i className="fa fa-arrow-left" />
                                </button>
                                <form className="search" onSubmit={this.search} >
                                    <input type="text" placeholder="Search..." value={this.state.search} onChange={e => this.setState({ search: e.target.value })} />
                                    <button>
                                        <i className="fal fa-search"></i>
                                    </button>
                                </form>
                            </div>
                            <ul className="navbar-nav ml-auto" >
                                <li className="nav-item" >
                                    <button className="bg-white nav-link" onClick={() => this.setState({ showSearch: true })} >
                                        <i className="fal fa-search"></i>
                                    </button>
                                </li>
                                <li className="nav-item" >
                                    <Link href="/messages" activeClassName="active" >
                                        <a className="nav-link">
                                            <i className="fal fa-comments"></i>
                                        </a>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="d-none d-lg-flex" style={{ flex: 1 }}  >
                        <form className="search" onSubmit={this.search} >
                            <input type="text" placeholder="Search..." value={this.state.search} onChange={e => this.setState({ search: e.target.value })} />
                            <button>
                                <i className="fal fa-search"></i>
                            </button>
                        </form>
                        <div className="comp collapse navbar-collapse">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <Link href="/feed" activeClassName="active" >
                                        <a className="nav-link">
                                            <i className="fal fa-home"></i>
                                        </a>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link href="/messages" activeClassName="active" >
                                        <a className="nav-link">
                                            <i className="fal fa-comments"></i>
                                        </a>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link href="/notifications" activeClassName="active" >
                                        <a className="nav-link">
                                            <i className="fal fa-bells"></i>
                                        </a>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link href="/menu" activeClassName="active" >
                                        <a className={"nav-link " + (this.props.active === 'menu' && 'active')}>
                                            <i className="fal fa-bars"></i>
                                        </a>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        {this.state.loggedOut ? <Link href="/login">
                            <a className="btn btn-fav my-1"  > <i className="fa fa-sign-in mr-2" /> Login</a>
                        </Link> : <Link href="/[profile]" as={"/" + this.state.userData.username} activeClassName="pActive">
                                <a className="my-1 d-flex p-1 align-items-center  rounded-pill">
                                    <Ppicture size="35px" src={this.state.userData.profilePicture} />
                                    <span className="text-dark font-weight-bold pl-2 pr-4 text-capitalize" >{this.state.userData.username}</span>
                                </a>
                            </Link>}
                    </div>
                </div>
            </nav>
            <div className="con ">
                {this.props.broken ? <Broken /> : this.props.children}
            </div>
            <nav className="p-0 navbar fixed-bottom navbar-expand navbar-light bg-white d-lg-none " id="navBottom" >
                {this.state.loggedOut ? <Link href="/login" ><a className="m-2 btn btn-block btn-fav" >
                    <i className="fa fa-sign-in mr-2" />
                    Login</a></Link> : <div className="collapse navbar-collapse  p-0">
                        <ul className="navbar-nav justify-content-between w-100 ">
                            <li className="nav-item">
                                <Link href="/feed" activeClassName="active" >
                                    <a className="nav-link">
                                        <i className="fal fa-home"></i>
                                    </a>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link href="/[profile]" as={"/" + this.state.userData.username} activeClassName="active">
                                    <a className="nav-link">
                                        <Ppicture size="23px" src={this.state.userData.profilePicture} />
                                    </a>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link href="/notifications" activeClassName="active" >
                                    <a className="nav-link">
                                        <i className="fal fa-bells"></i>
                                    </a>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link href="/menu" activeClassName="active" >
                                    <a className="nav-link">
                                        <i className="fal fa-bars"></i>
                                    </a>
                                </Link>
                            </li>
                        </ul>
                    </div>}
            </nav>
            <style jsx>{`
                   .wrappers {
                        background : #f7f7f7;
                        padding-top : 3rem;
                        padding-bottom : 3rem;
                        transition : all .3s;
                        min-height : 100vh;
                   }
             
                   .con {
                       max-width : 58rem;
                       margin : 0 auto;
                       min-height : 100%;
                       background : inherit;
                        transition : all .3s;
                   }
                   nav {
                       box-shadow : 0 0px 5px #0002;
                        transition : all .3s;
                   }
                   #navTop {
                       padding : 0;
                   }
                   .logo {
                      display :flex;
                      padding-left : 10px;
                      align-items : center;
                   }
                   .logo img {
                       height : 25px;
                   }
                   .comp .nav-link {
                       transition : all .3s;
                       padding : 8px 30px !important;
                   }
                   #navBottom .nav-link {
                              padding : 8px 30px !important;
                   }
                   .nav-link:hover {
                       color : #e52 !important
                   } 
                   .active {
                         border-bottom : 2px solid #e21;
                         color : #e52 !important;
                   }
                   .phone .nav-link {
                       padding : 10px 20px !important
                    }
                    .phone .nav-link i {
                        font-size : 24px;
                    }
                   
                   .comp .nav-link i {
                       font-size : 30px;
                       color : inherit;
                   }
                   .search {
                       border-radius : 20px;
                       display : flex;
                       background : #ff220022;
                       overflow : hidden;
                       align-self :  stretch;
                       margin : 5px 10px;
                       width : 30%;
                   }
                   .search > * {
                       align-self : stretch;
                       border : 0;
                       outline : 0;
                       background : none;
                       color : var(--black);
                       transition : all .3s;
                    }
                    .search input {
                        width : calc(100% - 35px);
                       padding : 0 15px;
                   }
                   ::placeholder {
                       color : var(--gray-dark)
                   }
                   .search button {
                       width : 35px;
                   }
                   .search button:hover {
                       background : #ff220044 ;
                   }
                   .phoneSearch {
                       background: var(--white);
                       position : absolute ;   
                       padding :0 10px;
                       top : 0;
                       z-index : 200;
                       left : 0;
                       align-items : center;
                       height : calc(100% + 2px);
                       width : 100%;
                   }
                   .phoneSearch form {
                       flex : 1;
                   }
                   .pActive {
                       background : #dddddd77;
                   }
                          .light_logo {
                       display : block;
                   }
                    .dark_logo {
                       display : none
                   }
                `}</style>
            <style jsx global>{`
                 body.dark .wrappers {
                       background : #060606;
                   }
                 body.dark  .light_logo {
                       display : none;
                   }
                   body.dark .dark_logo {
                       display : block
                   }
                 body.dim .wrappers {
                       background : #11131a;
                   }
                 body.dim  .light_logo {
                       display : none;
                   }
                   body.dim .dark_logo {
                       display : block
                   }
                   body.dark .search {
                       background : #f719;

                   }
            `}</style>
        </div>
    }
}
export default Profile