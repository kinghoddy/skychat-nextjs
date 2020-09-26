import React from 'react';

export default function Splashscreen(props) {
    const [hide, setHide] = React.useState(false);
    React.useEffect(() => {
        setTimeout(() => {

            setHide(true)
        }, props.time)
    }, [props.time])
    return <div className={"splash " + (hide ? 'hide' : '')} >

        <div className="text-center w-100" >
            <img src="/img/logo/skychat_red.png" className="logo_light" />
            <img src="/img/logo/skychat_light_1.png" className="logo_dark" />
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
               }
               .splash.hide {
                   visibility : hidden ;
                   opacity : 0;
               }
               .logo_dark {
                   display : none;
               }
               img {
                    width : 80%;
                    max-width : 16rem;
               }
        `}</style>
        <style jsx global>{`
                body.dark .logo_dark {
                    display : inline;
                }
                body.dim .logo_dark {
                    display : inline;
                }
                body.dark .logo_light {
                    display : none;
                }
                body.dim .logo_light {
                    display : none;
                }
        `}</style>
    </div>
}