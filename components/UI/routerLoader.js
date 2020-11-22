import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default (props) => {
  const router = useRouter();
  const [routing, setRouting] = useState(false);
  const [routerWidth, setRouterWidth] = useState(2);
  useEffect(() => {
    router.events.on("routeChangeStart", () => {
      setRouting(true);
      setTimeout(() => {
        setRouterWidth(15);
      }, 200);
      setTimeout(() => {
        setRouterWidth(65);
      }, 600);
      setTimeout(() => {
        setRouterWidth(98);
      }, 800);
    });
    router.events.on('routeChangeComplete', () => {
      setTimeout(() => {
        setRouterWidth(1008);
        setRouting(false)
      }, 800);
    });


  }, []);
  return (
    routing && (
      <div className="routing animated fadeIn faster">
        <div className="routing-progress"></div>

        <style jsx>{`
          .routing {
            transition: all 0.3s;
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            background : none;
            z-index: 1900;
          }
          .routing-progress {
            background: linear-gradient(to right, red, orange);
            height: 5px;
            width: ${routerWidth}%;
            transition: all 1s;

          }
          @media (min-width : 760px) {
            .routing {
            background: ${props.noShow ? 'none' : '#ffffffcc'};
            }
          }
        `}</style>
      </div>
    )
  );
};
