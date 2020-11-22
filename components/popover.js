import React from 'react'
import Modal from './UI/modal';

const Popover = ({ id, show, cancel = () => { }, buttons = [] }) => {
    return (show ? <Modal id={id} cancel={cancel}  >
        <div className="con animated fadeIn faster" >
            {buttons.map(cur => <button key={cur.title} className="button" onClick={() => {
                cur.action();
                cancel()
            }} >
                <i className={"fal mr-3 text-primary " + cur.icon} />
                {cur.title}</button>)}
            <button className="button" onClick={cancel} >
                <i className={"fal mr-3 fa-times text-danger"} />
                Cancel</button>
        </div>
        <style jsx>{`
        .con {
            background : var(--white);
            box-shadow : 0 4px 12px #0007;
            border-radius : 5px;
            margin : 0 auto;
            width : 18rem;
            position : relative;
            bottom : 50vh;
            transform : translateY(50%)
        }
        .button {
            text-align : left;
            width : 100%;
            padding : 10px;
            background : var(--white);
            color : var(--black);
        }
        .button:hover {
            background : var(--gray);
        }
        @media only screen and ( min-width : 1200px) {
            .con {
                bottom : 0;
             top : 50vh;
            transform : translateY(-50%)
            }
        }
           
    `}</style>
    </Modal> : null
    )
}

export default Popover