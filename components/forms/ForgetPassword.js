import React, { useState } from 'react'
import Modal from '../UI/modal'
import Input from '../UI/input'
import firebase from '../../firebase';
import 'firebase/auth';
import Spinner from '../UI/Spinner/Spinner';
function ForgetPassword({ cancel }) {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const submit = (e) => {
        e.preventDefault();
        setErrorMessage(null)
        setSubmitted('loading');
        var auth = firebase.auth();

        auth.sendPasswordResetEmail(email).then(function () {
            // Email sent.
            setSubmitted(true)
        }).catch(function (error) {
            // An error happened.
            setSubmitted(false)
            setErrorMessage(error.message)
        });
    }
    return (
        <Modal cancel={cancel} >

            <div className="FP animated slideInUp faster" >
                <div onClick={cancel} className="topBar" />
                <nav className="d-none d-md-flex navbar navbar-light shadow-sm navbar-expand" >
                    <button className="back-button mr-3" onClick={cancel} >
                        <i className="fa fa-arrow-left" />
                    </button>
                    <span className="navbar-brand" >Forget Password
                    <i className="ml-3 text-warning fal fa-lock-alt" />
                    </span>
                </nav>
                {errorMessage && <div className="alert alert-danger" >{errorMessage}</div>}
                {submitted === 'loading' ? <div className="spinner" > <Spinner /> </div> : submitted === true ? <div className="con" >
                    <h6 className="h5" > A password reset email has been sent successfully to {email} </h6>
                    <button className="btn btn-primary" onClick={cancel} >Ok</button>
                </div> : <div className="con" >
                        <h5 className="mb-4 d-md-none" >Forget Password
                    <i className="ml-3 text-warning fal fa-lock-alt" />
                        </h5>
                        <h6 className="" >Enter the email address  associated with your account</h6>
                        <p className="text" >We will email you a link to reset your password</p>
                        <form onSubmit={submit} >
                            <Input
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                label="Email Address" type="email" />
                            <button className="btn  btn-primary shadow-sm rounded-pill btn-block  " >Continue</button>
                        </form>
                    </div>}
            </div>
            <style jsx>{`
            .FP {
                 background : var(--white);
                 min-height : 50vh;
                 width : 100vw;
                 border-radius : 20px 20px 0 0;
                 position : relative;
                 padding : 1px;
            }
            .topBar {
                width : 40%;
                 border-radius : 10px;
                height : 4px;
                background : var(--secondary);
                margin : 15px auto;
            }
            .con {
                padding : 15px;
                display : flex;
                flex-direction : column ;
            }
            .spinner {
                height : 10rem;
            }
            .text {
                color : var(--gray-dark);
                line-height : 1.2;
            }
      
            @media (min-width : 760px) {
                .topBar {
                    display : none;
                }
                .FP {
                    border-radius : 0;
                    text-align : center;
                    height : 100vh;
                }
            }
            @media (min-width : 1200px) {
                   .FP {
                    height : 70vh;
                    top : 10vh;
                    width : 30rem;
                   }
            }
            `}</style>
        </Modal>
    )
}

export default ForgetPassword
