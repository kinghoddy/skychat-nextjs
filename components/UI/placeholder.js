import React from 'react';
export default props => {
    return <div style={{ ...props.style }} className="overflow-hidden w-100 bg-light position-relative">
        <div className="ani"></div>
        <style jsx>{`
           .ani {
               animation : slide 1s infinite linear;
               height : 100%;
               width : 100px;
               background : linear-gradient(to right , #eee9 , #eee , #eee9);
           }
           @keyframes slide {
               0% {
                  transform : translateX(-5rem);
                }
                100% {
                    transform : translateX(100vw);
               }
           } 
        `}</style>
    </div>
}