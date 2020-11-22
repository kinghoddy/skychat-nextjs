import React from "react";
import Link from "next/link";
import Head from "next/head";
import RouterLoader from "../components/UI/routerLoader";
import Router from "next/router";
export default (props) => {

    return (
        <div className="wrapper position-relative">
            <Head>
                <title>Skychat | Enjoy messaging in the Clouds </title>
                <meta property="og:title" content='Skychat | Enjoy messaging in the Clouds ' />
                <link rel="shortcut icon" href="/img/logo/logo_red.png" />
                <meta property="og:image" content={"/img/logo/icon-512.png"} />
            </Head>
            <RouterLoader />

            <nav className="navbar navbar-light  navbar-expand-lg fixed-top bg-light">
                <Link href="/">
                    <a className="navbar-brand ">
                        <img src="/img/logo/skychat_red.png" />
                    </a>
                </Link>
                <button
                    className="navbar-toggler"
                    data-target="#nav"
                    data-toggle="collapse"
                >
                    <i className="fa fa-bars"></i>
                </button>
                <div className="collapse navbar-collapse" id="nav">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item ">
                            <Link activeClassName="active" href="/">
                                <a className="nav-link">Home</a>
                            </Link>
                        </li>
                        <li className="nav-item ">
                            <Link activeClassName="active" href="/projects">
                                <a className="nav-link">Download</a>
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
            <header>
                <div className="container">
                    <div style={{ minHeight: '100vh' }} className="row py-3 align-items-center">
                        <div className="py-4 col-lg-6">
                            <img alt="" src="/img/slides/5.jpg" className="my-4 img-fluid" />
                        </div>
                        <div className=" col-lg-6">
                            <div className="buttons">
                                <Link href="/signup">
                                    <a className="btn btn-block btn-fav">
                                        <i className="fal fa-sign-in-alt mr-3" />
                    Create an account</a>
                                </Link>
                                <Link href="/login">
                                    <a className="btn btn-block btn-fav">
                                        <i className="fal fa-sign-in mr-3" />
                    Have an account ? Login</a>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <style jsx>{`
        .wrapper{
          background : #fff
        }
        nav {
          background : #fff !important;
          box-shadow : 0 3px 8px #0002;
        }
        nav *{
          color : #000 !important;
        }
        nav img {
          height: 2rem;
        }
        header {
          margin-top : 3rem;
        }
        .logos img {
          margin: 10px;
          height: 20px;
        }
        @media only screen and (min-width : 1200px) {
          header {
            margin-top : 0;
          }
        }
       `}</style>
        </div>
    );
};
