import React from "react";
import Layout from "../components/layouts/auth";
import Link from "next/link";
import firebase from "../firebase";
import "firebase/auth";
import "firebase/database";
import Router from "next/router";
import { isWindow } from "jquery";
import ForgetPassword from "../components/forms/ForgetPassword";

class Login extends React.Component {
  state = {
    formData: {
      email: "",
      password: "",
    },
    error: null,
    showForgetPassword: false,
    loading: false,
  };
  inputChanged = (e, types) => {
    const form = { ...this.state.formData };
    form[types] = e.target.value;
    this.setState({ formData: form });
  };
  googleLogin = () => {
    this.setState({
      loading: true,
      sMessage: "Checking info  !",
      errorMessage: null,
    });
    var provider = new firebase.auth.GoogleAuthProvider();
    let action = () => firebase
      .auth()
      .signInWithPopup(provider).then(this.proceed).catch((error) => {
        var errorMessage = error.message;
        this.setState({ errorMessage: errorMessage, loading: false });
      });;
    if (window.Android) action = () => firebase.auth().signInWithRedirect(provider).then(function () {
      return firebase.auth().getRedirectResult();
    }).then(this.proceed).catch((error) => {
      var errorMessage = error.message;
      this.setState({ errorMessage: errorMessage, loading: false });
    });
    action()


  };
  signInHandler = (event) => {
    event.preventDefault();
    this.setState({ loading: true, error: null });
    const formData = { ...this.state.formData };
    firebase
      .auth()
      .signInWithEmailAndPassword(formData.email, formData.password)
      .then((res) => {
        // User is signed in.
        var user = res.user;
        this.fetchUser(user);
      })
      .catch((e) => {
        // Handle Errors here.
        var error = e.message;
        console.log(e, "error");
        this.setState({ loading: false, error: error });
        // ...
      });
  };
  proceed = (result) => {
    this.setState({ loading: false })
    if (result.credential) {
      // This gives you a Google Access Token.
      // You can use it to access the Google API.
      var user = result.user;
      if (result.additionalUserInfo.isNewUser === true) {
        firebase
          .auth()
          .currentUser.delete()
          .then(() => {
            this.setState({
              loading: false,
              error: (
                <span>
                  "This Google account is not attached to any skychat account.
                  <Link href="/signup">
                    <a>Create an account instead</a>
                  </Link>
                </span>
              ),
            });
          });
      } else {
        this.fetchUser(user);
      }
      // ...
    }
  }

  componentDidMount() {
    this.setState({ loading: true })
    firebase.auth().getRedirectResult().then((result) => {
      if (result) this.proceed(result)
      else this.setState({ loading: false })
    })
  }
  fetchUser = (user) => {
    this.setState({ sMessage: "Logging in.." });
    var uid;
    if (user != null) {
      uid = user.uid;
      this.setState({ loading: false, error: null, shouldLogin: true });
    } else {
      var error = <strong>Failed</strong>;
      this.setState({ loading: false, error: error });
    }
    if (this.state.shouldLogin) {
      localStorage.clear();
      var search = Router.query.route;
      if (search) {
        Router.push("/" + search);
      } else {
        Router.push("/feed");
      }
    }
  };

  render() {
    return (
      <Layout title="Login | Skychat " loading={this.state.loading}>
        {this.state.showForgetPassword && <ForgetPassword
          cancel={() => this.setState({ showForgetPassword: false })}
        />}
        <h3>Welcome Back</h3>
        <p>Login to your skychat account to continue</p>
        {this.state.error && (
          <div className="alert alert-danger">
            <strong>Error: </strong>
            {this.state.error}
          </div>
        )}
        <form onSubmit={this.signInHandler}>
          <input
            type="email"
            onChange={(e) => this.inputChanged(e, "email")}
            value={this.state.formData.email}
            required
            placeholder="Email address"
          />
          <input
            type="password"
            onChange={(e) => this.inputChanged(e, "password")}
            value={this.state.formData.password}
            required
            placeholder="Password"
          />
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <a href="#" onClick={() => this.setState({ showForgetPassword: true })} >Forgot Password ?</a> <br />
              <Link href="/signup">
                <a>Create an account</a>
              </Link>
            </div>
            <button className="text-light btn btn-fav px-4">Login</button>
          </div>
        </form>
        <div className="mt-3">
          <h6 className="px-2">You can also login with google</h6>
          <button onClick={this.googleLogin} className=" rounded-pill google">
            <img src="/img/google.png" />
            <span className="px-2">Continue with google</span>
          </button>
        </div>
        <style jsx>
          {`
                  h3 ,p , div {
            color : #000;
          }
          form {
              width : 100%;
          }
            form input {
                display : block;
                padding : 10px;
                width : 100%;
                border : 0;
                outline : 0;
                border-bottom : 2px solid #f73;
                margin-bottom : 20px;
                background : none;
                color : #000
            }
            ::placeholder {
              color : #777
            }
            form input:focus {
                border-bottom : 2px solid #fc3;
            }
            .btn-login {
                background : linear-gradient(to right , orange , red);
                color : white;
            }
            .google:focus {
              outline : 0;
              background : #37a;
            }
            .google {
                background : #38f;
                height : 2.3rem;
                border : 0;
                outline : 0;
                text-transform : uppercase;
                display : flex;
                align-items : center;
                font-weight : bold;
                padding : 2px;
                color: #fff;
            }
            .google img {
                height : 100%;
                   object-fit : contain;
                max-width : 30px;
            }
        `}
        </style>
      </Layout>
    );
  }
}
export default Login;
