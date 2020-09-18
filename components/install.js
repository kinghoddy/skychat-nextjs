import React, { Component } from 'react'

export default class Install extends Component {
    state = {
        show: false,
        installing: false
    }
    componentDidMount() {
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            deferredPrompt = e;
            // Update UI notify the user they can install the PWA
            this.setState({ show: true })
            const buttonInstall = document.getElementById('installBtn');
            buttonInstall.addEventListener('click', (e) => {
                // Hide the app provided install promotion
                this.setState({ installing: true })
                // Show the install prompt
                deferredPrompt.prompt();
                // // Wait for the user to respond to the prompt
                deferredPrompt.userChoice.then((choiceResult) => {
                    this.setState({ show: false })
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                    } else {
                        console.log('User dismissed the install prompt');
                    }
                });
            });

        });
        window.addEventListener('appinstalled', (evt) => {
            this.setState({ show: false })
            // Log install to analytics
            console.log('INSTALL: Success');
        });
    }

    render() {
        return !this.state.show ? null : (<React.Fragment>
            <div className="backdrop" />
            <div className="con" >
                <button className="cancel" onClick={() => this.setState({ show: false })} >
                    <i className="fal fa-times" />
                </button>
                <nav className="border-bottom mb-2" >
                    <img src="/img/logo/logo_red.png" className="logo" />
                    <h5 className="text-center" >Install skychat</h5>
                </nav>
                {this.state.installing ? <div className="py-3 d-flex align-items-center justify-content-center" >
                    <div className="spinner-border text-warning mr-3" /> Installing
                </div> : <React.Fragment>
                        <p className="px-2" >
                            Hello fam !! <br /> Skychat has unlocked the secret of the web. 💪 💪
                    Add skychat to your home screen and easily access it anytime in less than 10 sec;
                </p>
                        <button id="installBtn" className="btn rounded-pill btn-fav btn-block" >Install now</button>
                    </React.Fragment>}

            </div>
            <style jsx>{`
            .logo {
                height : 4rem;
                display : block;
                margin : 10px auto;
            }
            .cancel {
                position : absolute;
                left : 10px;
                top : 10px;
                z-index : 500;
                background : none;
            }
            .cancel i {
                font-size : 20px
            }
                   .con {
                       border-radius : 10px;
                       padding : 20px;
                       text-align : center;
                       position : fixed ;
                       z-index : 1200;
                       top : 10rem;
                       left : 50%;
                       transform : translateX(-50%);
                       background : var(--white);
                       max-width : 30rem;
                       width : 90vw;
                   }   
                `}</style>
        </React.Fragment>
        )
    }
}
