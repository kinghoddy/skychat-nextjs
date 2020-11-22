import React, { Component } from "react";
import Link from "next/link";
import firebase from "../../firebase";
import "firebase/auth";
import "firebase/database";
import Spinner from "../../components/UI/Spinner/Spinner";
import Layout from "../../components/layouts/auth.js";
import Router from "next/router";
class SignUp extends Component {
  state = {
    formData: {
      fullName: '',
      username: "",
      email: "",
      password: "",
    },
    profilePicture: "",
    errorMessage: null,
    setname: false,
    sMessage: "Please Wait ! ! !",
    loading: false,
    usernameExists: false,
    shouldLogin: false,
  };
  inputChanged = (e, types) => {
    const form = { ...this.state.formData };
    form[types] = e.target.value;
    if (types == 'username') form[types] = sanitize(e.target.value)
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
  proceed = (result) => {
    var user = result.user;
    const id = user.uid;
    firebase
      .database()
      .ref("users")
      .once("value", (s) => {
        if (s.val()[id]) {
          this.setState({
            loading: false,
            userExist: true,
            errorMessage: (
              <div>
                <img
                  src={s.val()[id].profilePicture}
                  style={{ height: "50px", width: "50px" }}
                  className="rounded-circle"
                  alt=""
                />
                    User {s.val()[id].username} already exists. You can
                <Link href="/feed">
                  <a> Login </a>
                </Link>
                    to continue
              </div>
            ),
          });
        } else {
          this.setState({ loading: false });
          this.setState({ setname: true, profilePicture: user.photoURL });
        }
      });
  }

  componentDidMount() {
    this.setState({ loading: true })
    firebase.auth().getRedirectResult().then((result) => {
      if (result) this.proceed(result)
      else this.setState({ loading: false })
    }).catch(() => this.setState({ loading: false }))
  }

  saveUser = (e) => {
    e.preventDefault();
    // this.setUserName(this.state.formData.username);
    this.setState({ errorMessage: null })
    if (!this.state.usernameExists && this.state.formData.username && this.state.formData.fullName) {

      this.setState({ loading: true, sMessage: "Completing Signup  !" });
      const user = firebase.auth().currentUser;
      user.updateProfile({
        displayName: this.state.formData.username,
      });
      var ref = firebase.database().ref("users/");
      ref.once("value", (s) => {
        const id = user.uid;
        ref
          .child(id)
          .update({
            username: this.state.formData.username,
            profilePicture: user.photoURL,
            coverPhoto: '/img/avatar-square.png',
            fullName: this.state.formData.fullName.toLowerCase()
          })
          .then(() => {
            localStorage.removeItem('skychatUserData');
            localStorage.removeItem("skychatFeed");
            var search = Router.query.route;
            setTimeout(() => {
              if (search) {
                Router.push("/" + search);
              } else {
                Router.push("/feed");
              }
            }, 2000)
          })
          .catch(() => {
            this.setState({
              loading: false,
              errorMessage: "Failed to save user to database",
            });
          });
      });
    }
    if (this.state.usernameExists) {
      this.setState({ errorMessage: 'Username Exists. Pick another' })
    }
  };
  setUserName = () => {
    let userExists
    this.setState({ nameLoading: true });
    var ref = firebase.database().ref("users/");
    const routes = [
      'menu', 'messages', 'highlights', 'notifications', 'post', 'login', 'signup', 'feed', 'vc', 'privacy'
    ]
    setTimeout(() => {
      if (routes.indexOf(this.state.formData.username) > -1) this.setState({ usernameExists: true, nameLoading: false });
      else ref.orderByChild('username').equalTo(this.state.formData.username).once('value', s => {
        if (s.val()) userExists = true;
        else userExists = false
        this.setState({ usernameExists: userExists, nameLoading: false });
      });
    }, 500)
  };
  signUpHandler = (event) => {
    event.preventDefault();
    this.setState({
      loading: true,
      sMessage: "Checking info",
      errorMessage: null,
    });
    const formData = { ...this.state.formData };
    firebase
      .auth()
      .createUserWithEmailAndPassword(formData.email, formData.password)
      .then((res) => {
        var user = firebase.auth().currentUser;
        this.setState({ sMessage: "Please wait" });
        user
          .updateProfile({
            photoURL: "/img/avatar-red.png",
          })
          .then(() => {
            this.setState({ loading: false });
            this.setState({ setname: true, profilePicture: user.photoURL });
            this.setUserName();
          });
      })
      .catch((error) => {
        // Handle Errors here.
        var errorMessage = error.message;
        this.setState({ loading: false, errorMessage: errorMessage });
        // ...
      });
  };
  render() {
    return (
      <Layout
        title="SignUp  | Skychat "
        loading={this.state.loading}
        sMessage={this.state.sMessage}
      >
        <h3>Join Skychat today</h3>
        <p>Create a skychat account to continue</p>
        {this.state.errorMessage && (
          <div className="alert alert-danger">
            <strong>Error: </strong>
            {this.state.errorMessage}
          </div>
        )}
        {this.state.setname ? (
          <React.Fragment>
            <div className="profile">
              <img src={this.state.profilePicture} alt="" />
              <p>{this.state.formData.email}</p>
              <h5>Pick a username</h5>
              <span>It may include '_'. </span> <br />
              <span>
                Do not include '@' , '-' , '/' , '#' , '?' , '[] , {} , ()' ,
                '=' or any other non alphabetic character.
              </span>
            </div>
            <form onSubmit={this.saveUser}>
              <div className="d-flex align-items-center" >

                {this.state.nameLoading ? (
                  <div
                    style={{ height: "20px", width: "20px" }}
                    className="text-primary spinner-border mr-2"
                  ></div>
                ) : this.state.formData.username && <i className={"mr-2 fal fa-2x " + (this.state.usernameExists ? 'fa-times text-danger' : 'fa-check text-success')} />}

                <input
                  onChange={(e) => {
                    this.setUserName();
                    this.inputChanged(e, "username");
                  }}
                  value={this.state.formData.username}
                  required
                  minLength="4"
                  placeholder="username"
                />
              </div>
              <input
                type="text"
                onChange={(e) => this.inputChanged(e, "fullName")}
                value={this.state.formData.fullName}
                minLength="4"
                required
                placeholder="Full name"
              />
              {!this.state.usernameExists && !this.state.nameLoading && this.state.formData.username && this.state.formData.fullName && (
                <button
                  className="btn btn-fav text-light"
                >
                  Finish
                </button>
              )}
            </form>
          </React.Fragment>
        ) : (
            <form onSubmit={this.signUpHandler}>

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
                  Already have an account ?
                <Link href="/login">
                    <a>Login</a>
                  </Link>
                </div>
                <button className="text-light btn btn-fav  px-3">
                  Next <i className="fal fa-arrow-right"></i>
                </button>
              </div>
            </form>
          )}
        {!this.state.setname && (
          <div className="mt-3">
            <h6 className="px-2">You can also signup with google</h6>
            <button onClick={this.googleLogin} className=" rounded-pill google">
              <img src="/img/google.png" />
              <span className="px-2">Continue with google</span>
            </button>
          </div>
        )}
        <style>
          {`
          
          h3 ,p , div {
            color : #000;
          }
          .profile {
             text-align : center;
          }
          .profile img {
              height : 5rem;
              width : 5rem;
              border-radius : 50%;
              border : 3px solid #e20;
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
                border-bottom : 2px solid #f20;
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

const sanitize = (text = '') => {
  let sanitizedText = text.replace(/[-[\]{}();:'"@=<>*+?.,\\^$|#\s]/g, '').trim().toLowerCase();
  return sanitizedText
}
export default SignUp;
