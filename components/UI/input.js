import React from 'react';

const Input = props => {
    return <div className="input" >
        <label>{props.label}</label>
        {props.type === 'textarea' ? <textarea placeholder={"Add " + props.label} value={props.value} onChange={props.onChange} /> :
            <input type={props.type} placeholder={"Add " + props.label} value={props.value} onChange={props.onChange} />}
        <style jsx>{`
             .input {
                 background : var(--white) ;
                 margin-bottom : 10px;
             }
             label {
                 font-size : 12px;
                 display : block;
                 color : #0008;
                 margin-bottom : 0;
                 text-transform : capitalize;
                 padding: 5px 10px 0;
             }
             .input textarea , .input input {
                 border-bottom : 1px solid #0005;
                 width : 100%;
                 transition : all .5s;
                 color : var(--black);
                 text-transform : ${props.cap ? 'capitalize' : 'unset'};
                 font-weight : bold;
                 padding : 5px
             }
             ::placeholder {
                 font-weight : 400;
                 color : #0005;
             }
             .input textarea:focus , .input input:focus {
                 border-bottom : 2px solid #f20;
             }
        
        `}</style>
    </div>
}

export default Input