import React from 'react';

export default function Splashscreen({ hide }) {

    return <div className={"splash " + (hide ? 'hide' : '')} >
        <div className="text-center" >

            <img src="/img/logo/logo_red.png" className=" logo dark" />
            <h6 className="text-muted mt-2">Starting Skychat</h6>
            <div className="progress" >
                <span className="animated slideInLeft infinite w-100 bg-primary" />
            </div>
        </div>


        <style jsx>{`
               .splash {
                   background : var(--white);
                   position : fixed ;
                   bottom : 0;
                   left : 0;
                   z-index : 2000;
                   display : flex;
                   width : 100vw;
                   height : 100vh;
                   transition : all .3s;
                   align-items : center;
                   justify-content : center;
               }
               .hide {
                   opacity : 0;
                   visibility : hidden
               }
               .logo {
                   height : 3rem;
               }
               .progress {
                   height : 5px;
               }
               .progress span {
                   animation-duration : 2s;
               }
  
        `}</style>
        <style global jsx>{`
            body {
                overflow : ${hide ? 'auto' : 'hidden'} 
            }
 
        `}</style>
    </div>
}