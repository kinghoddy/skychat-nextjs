import React from "react";
import Link from "next/link";
import Head from "next/head";
import RouterLoader from "../components/UI/routerLoader";
export default (props) => {
  return (
    <div className="wrapper position-relative">
      <Head>
        <title>Skychat | Enjoy messaging in the Clouds </title>
        <meta property="og-image" content="/img/logo/favicon.png" />
        <link rel="shortcut icon" href="/img/logo/logo.png" />
      </Head>
      <RouterLoader />

      <nav className="navbar navbar-light border-bottom navbar-expand-lg fixed-top bg-light">
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
          <Link href="/login">
            <a className="btn btn-sm btn-primary">Login</a>
          </Link>
          <Link href="/login">
            <a className="btn btn-sm btn-primary">SignUp</a>
          </Link>
        </div>
      </nav>
      <header>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0 text-center text-lg-left">
              <h1 className="font-weight-light text-uppercase px-3">
                Welcome to skychat
              </h1>
              <span className="px-3 text-uppercase">By king Hoddy</span>
              <div className="mt-3 logos  ">
                <img src="/img/logo/skychat_light_1.png" />
                <img src="/img/logo/skychat_blue.png" />
                <img src="/img/logo/logo_red.png" />
                <img src="/img/logo/skychat_light_2.png" />
                <img src="/img/logo/skychat_red.png" />
                <img src="/img/logo/logo_blue.png" />
              </div>
            </div>
            <div className="col-lg-6">
              <Link href="/login">
                <a className="btn btn-primary btn-block">
                  Login to Your Account
                </a>
              </Link>
              <Link href="/signup">
                <a className="btn btn-primary btn-block">Create an account</a>
              </Link>
              <Link href="/">
                <a className="btn btn-primary btn-block">Download The App</a>
              </Link>
            </div>
          </div>
        </div>
      </header>
      <section>
        <div className="container">
          <div className="row py-1 align-items-center">
            <div className="col-lg-6">
              <img src="/img/slides/2.jpg" className="image" />
            </div>
            <div className="col-lg-6">
              <h1>This is me</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni
                quos fuga, corrupti nostrum nulla corporis, est commodi
                voluptatibus hic adipisci distinctio omnis cumque voluptates
                autem nemo eius dolores excepturi! Facere!
              </p>
            </div>
          </div>

          <div className="row py-1 align-items-center">
            <div className="col-lg-6">
              <h1>This is me</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni
                quos fuga, corrupti nostrum nulla corporis, est commodi
                voluptatibus hic adipisci distinctio omnis cumque voluptates
                autem nemo eius dolores excepturi! Facere!
              </p>
            </div>

            <div className="col-lg-6">
              <img src="/img/slides/3.jpg" className="image" />
            </div>
          </div>

          <div className="row py-1 align-items-center">
            <div className="col-lg-6">
              <img src="/img/slides/4.jpg" className="image" />
            </div>
            <div className="col-lg-6">
              <h1>This is me</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni
                quos fuga, corrupti nostrum nulla corporis, est commodi
                voluptatibus hic adipisci distinctio omnis cumque voluptates
                autem nemo eius dolores excepturi! Facere!
              </p>
            </div>
          </div>
        </div>
      </section>
      <style jsx>{`
        nav {
        }
        nav img {
          height: 2rem;
        }
        header {
          padding-top: 2.5rem;
          height: 80vh;
          min-height: 35rem;
          background: linear-gradient(to right bottom, #e82, #e02);
          background-size: cover;
          display: flex;
          align-items: center;
          color: white;
          background-position: center;
        }
        .logos img {
          margin: 10px;
          height: 20px;
        }
        section {
          padding: 4rem 0;
        }
        section .image {
          width: 100%;
          height: 25rem;
          object-fit: cover;
        }
        @media only screen and (min-width: 760px) {
          header h1 {
            font-size: 3.4rem;
          }
        }
      `}</style>
    </div>
  );
};
