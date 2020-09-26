import React from 'react'

const Popover = (props) => {
    return (props.show ? <React.Fragment>
        <div className="backdrop" onClick={props.cancel} />
        <div className="con animated fadeIn faster" >
            {props.buttons.map(cur => <button key={cur.title} className="button" onClick={() => {
                cur.action();
                props.cancel()
            }} >
                <i className={"fal mr-3 text-primary " + cur.icon} />
                {cur.title}</button>)}
            <button className="button" onClick={props.cancel} >
                <i className={"fal mr-3 fa-times text-danger"} />
                Cancel</button>
        </div>
        <style jsx>{`
        .con {
            position : fixed;
            bottom : 50%;
            z-index: 1300;
            left : 50%;
            transform : translate(-50% , 50%);
            background : var(--white);
            box-shadow : 0 4px 12px #0007;
            border-radius : 5px;
            width : 80%;
            max-width : 20rem;
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
           
    `}</style>
    </React.Fragment> : null
    )
}

export default Popover