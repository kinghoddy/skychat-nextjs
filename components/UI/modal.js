import React from 'react';
import { useRouter } from 'next/router'

export default function Modal(props) {
    const router = useRouter();

    React.useEffect(() => {

        router.beforePopState(cb => {
            cancel()
            return false
        })
        window.addEventListener('keyup', handleEsc, false);
        return () => window.removeEventListener('keyup', handleEsc, false);
    }, [])
    const handleEsc = e => {
        if (e.keyCode === 27) cancel();
    }
    const cancel = () => {
        window.removeEventListener('keyup', handleEsc, false)
        return props.cancel && props.cancel()
    }
    return <React.Fragment>
        <div className="backdrop animated fadeIn" onClick={cancel} />
        <div className="Modal animated fadeInUp" style={{ ...props.style }} >
            {props.children}
        </div>
        <style jsx>{`
             .Modal {
           position : fixed;
           margin : auto;
           touch-action : pinch-zoom;
           animation-duration : .5s;
           z-index : 1500;
           bottom : 0;
       }
                 @media only screen and (min-width : 760px) {
                    .Modal {
                        bottom : unset;
                        top : 0;
                        left : calc(50% - 17.5rem);
                    }
                }
        
        `}</style>

    </React.Fragment>
}