import React from 'react';
import { useRouter } from 'next/router'

export default function Modal(props) {
    const router = useRouter();

    React.useEffect(() => {
        window.location.hash = props.id || '#sky'
        router.beforePopState(cb => {
            if (router.asPath === cb.as) {
                cancel()
                return false
            } else {
                return true
            }

        })
        window.addEventListener('keyup', handleEsc, false);
        return () => window.removeEventListener('keyup', handleEsc, false);
    }, [props.id])
    const handleEsc = e => {
        if (e.keyCode === 27) cancel();
    }
    const cancel = () => {
        let hash = window.location.hash;

        hash && (router.back())
        window.removeEventListener('keyup', handleEsc, false)
        return props.cancel && props.cancel()
    }
    return <React.Fragment>
        {!props.hideBackdrop && <div className="backdrop animated fadeIn" onClick={cancel} />}
        <div className="Modal " style={{ ...props.style }} >
            {props.children}
        </div>
        <style jsx>{`
             .Modal {
           position : fixed;
           margin : auto;
           touch-action : pinch-zoom;
           animation-duration : .5s;
           z-index : 1300;
           bottom : 0;
           left : 50%;
           transform: translateX(-50%)
       }
                 @media only screen and (min-width : 760px) {
                    .Modal {
                        bottom : unset;
                        top : 0;
                    }
                }
        
        `}</style>

    </React.Fragment>
}