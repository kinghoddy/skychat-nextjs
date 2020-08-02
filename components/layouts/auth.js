import React from "react";
import Head from "next/head";
import Link from "next/link";
import Spinner from "../UI/Spinner/Spinner";
import RouterLoader from "../UI/routerLoader";
export default (props) => {
  return (
    <div className="wrapper">
      <Head>
        <title>{props.title}</title>
        <link rel="shortcut icon" href="/img/logo/logo_red.png" />
        <meta property="og:image" content="/img/logo/logo_red.png" />
      </Head>
      <RouterLoader />
      <div className="row no-gutters">
        <div className="col-lg-6 col-md-8 children ">
          {props.loading && (
            <div className="loader">
              <Spinner message={props.sMessage} />
            </div>
          )}
          <div style={{ maxWidth: "30rem" }} className="w-100">
            {props.children}
            <ul className="mt-5">
              <li>
                <Link href="/">
                  <a>Home </a>
                </Link>
              </li>
              <li>
                <Link href="/download">
                  <a>Download the app </a>
                </Link>
              </li>
              <li>
                <Link href="/download">
                  <a>Contact </a>
                </Link>
              </li>
              <li>
                <Link href="/download">
                  <a>Terms and conditions </a>
                </Link>
              </li>
            </ul>
            <div>
              <span>Skychat by kinghoddy</span>
              <img
                src="https://kinghoddy.now.sh/logo.png"
                style={{ height: "50px" }}
                className="mx-2"
                alt="logo"
              />
              <img
                className="mx-2"
                src="/img/logo/skychat_red.png"
                style={{ height: "20px" }}
                alt="logo"
              />
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .wrapper {
          background: url(/img/slides/4.jpg) center;
          background-size: cover;
        }

        .children {
          min-height: 100vh;
          display: flex;
          align-items: center;
          position  : relative
          justify-content: center;
          background: #ffffffee;
          padding: 2rem;
        }
        .loader {
            position : absolute;
            height : 100%;
            width : 100%;
            left : 0;
            top : 0;
            background : #ffffffcc ;
        }
        ul {
          padding: 0;
        }
        ul li {
          display: inline-block;
          margin-right: 10px;
        }
      `}</style>
    </div>
  );
};
