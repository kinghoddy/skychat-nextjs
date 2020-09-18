import React from "react";
import Layout from "../components/layouts/auth";
import Link from "next/link";
import firebase from "../firebase";
import "firebase/auth";
import "firebase/database";
import Router from "next/router";

class Login extends React.Component {
  state = {
    formData: {
      email: "",
      password: "",
    },
    error: null,
    loading: false,
  };
  inputChanged = (e, types) => {
    const form = { ...this.state.formData };
    form[types] = e.target.value;
    this.setState({ formData: form });
  };
  googleLogin = () => {
    this.setState({ loading: true, sMessage: "Checking info" });

    var provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        this.setState({ errorMessage: null, loading: false });
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
      })
      .catch((e) => {
        var errorMessage = e.message;
        this.setState({
          error: (
            <span>
              <strong>Failed </strong>
              {errorMessage}
            </span>
          ),
          loading: false,
        });
      });
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
      localStorage.removeItem('skychatUserData');
      localStorage.removeItem("skychatFeed");
      var search = Router.query.route;
      if (search) {
        Router.push("/" + search);
      } else {
        Router.push("/feed");
      }
    }
  };
  componentDidMount() {
    // firebase.auth().onAuthStateChanged();
  }
  render() {
    return (
      <Layout title="Login | Skychat " loading={this.state.loading}>
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
              <a href="#">Forgot Password ?</a> <br />
              <Link href="/signup">
                <a>Create an account</a>
              </Link>
            </div>
            <button className="text-light btn btn-login px-4">Login</button>
          </div>
        </form>
        <div className="mt-3">
          <h6 className="px-2">You can also login with google</h6>
          <button onClick={this.googleLogin} className=" rounded-pill google">
            <img src="/img/google.png" />
            <span className="px-2">Continue with google</span>
          </button>
        </div>
        <style>
          {`
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
                height : 100%
            }
        `}
        </style>
      </Layout>
    );
  }
}
export default Login;
