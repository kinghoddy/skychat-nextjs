import React, { useRef, useState } from 'react';
import Modal from './modal';

export default function SwipableTab(props) {
    const [activeTab, setActiveTab] = useState(null);
    const contents = useRef()
    const scrollBar = useRef()
    const switchTab = (i) => {
        let scrollPoint = 0
        if (i) scrollPoint = contents.current.scrollWidth / props.tabContent.length * i;
        contents.current.scrollLeft = scrollPoint;
    }
    React.useEffect(() => {
        if (contents.current) {
            contents.current.addEventListener('scroll', checkTab, false)
            checkTab()
            if (props.autoFocus) switchTab(props.autoFocus)
        }
    }, [])
    React.useEffect(() => {
        if (activeTab && props.onTabChanged) props.onTabChanged(activeTab)
    }, [activeTab])
    const checkTab = () => {
        const tabs = Array.from(contents.current.children);
        const scrollPoint = contents.current.scrollLeft / contents.current.scrollWidth * 100 + '%'
        if (scrollBar.current) scrollBar.current.style.left = scrollPoint;
        let tabWidth = contents.current.scrollWidth / props.tabContent.length / 2
        const conLeft = contents.current.getBoundingClientRect().left
        tabs.forEach(cur => {
            let left = cur.getBoundingClientRect().left - conLeft;
            if (left >= -tabWidth && left <= tabWidth) setActiveTab(cur.id)
        })
    }

    return (
        <div className="tabCon " id={props.id} >
            {props.position !== 'bottom' && <nav className="navbar navbar-expand p-0" >
                <ul className="navbar-nav" >
                    {props.tabNav.map((cur, i) => <li key={cur.id} className="nav-item" >
                        <button className={"tab-button " + (cur.id === activeTab ? 'active' : '')} onClick={e => switchTab(i)} >
                            {cur.text}
                        </button>
                    </li>)}
                </ul>
                {props.type !== 'tabs' && <div className="scrollbar" ref={scrollBar} />}
            </nav>}
            <div className="tabContents" ref={contents} >
                {props.tabContent.map(cur => <div key={cur.id} id={cur.id} className="tabContent" >
                    {cur.component}
                </div>)}
            </div>
            {props.position === 'bottom' && <nav className="navbar navbar-expand p-0" >
                <ul className="navbar-nav" >
                    {props.tabNav.map((cur, i) => <li key={cur.id} className="nav-item" >
                        <button className={"tab-button " + (cur.id === activeTab ? 'active' : '')} onClick={e => switchTab(i)} >
                            {cur.text}
                        </button>
                    </li>)}
                </ul>
                {props.type !== 'tabs' && <div className="scrollbar" ref={scrollBar} />}
            </nav>}

            <style jsx>{`
           .tabCon {
               height : 100%;
               width : 100%;
               display : flex;
               flex-direction : column;
           }
           .navbar {
               background : var(--white);
               position : relative;
               z-index : 1;
               box-shadow: 0 ${props.position === 'bottom' ? '-' : ''}3px 5px #0002;
           }
           .scrollbar {
               background : var(--fav);
               height : 3px;
               border-radius : 6px;
               width : calc(100% / ${props.tabContent.length});
               position : absolute;
               z-index : 1000;
               bottom : -2px;
           }
           .navbar-nav {
               width : 100%;
           }
           .nav-item {
               flex : 1;
           }
           .tab-button {
              width : 100%;
              padding : ${props.type === 'tabs' ? '5px 0' : '15px 0'} ;
              transition : .3s;
              background : none;
              color : var(--gray-dark)
           }
           .tab-button:active {
               background : var(--secondary)
           }
           .tab-button.active {
               color : ${props.activeColor || 'var(--red)'};
               font-weight : 600;
           }
           .tabContents {
               display : flex;
               overflow-x : auto;
               overflow-y : hidden;

               flex : 1;
                scroll-behavior  : smooth;
                scroll-snap-type: X mandatory;
           }
           ::-webkit-scrollbar {
               height : 0;
               width : 0;
           }
           .tabContent {
               width : 100%;
                scroll-snap-align: start;
               scroll-snap-stop: always;
               height : 100%;
               flex-shrink : 0;
               overflow : auto
           }
           @media (min-width : 1200px) {
               ::-webkit-scrollbar {
                   width : unset;
               }
           }
        `}</style>
            <style jsx global>{`
               body.dark .tabCon {
                   background : #000;
               }
               body.dim .tabCon {
                   background : #001119;
               }
            `}</style>
        </div>
    )
}
