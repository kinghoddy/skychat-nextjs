import React from 'react';
import FlipMove from 'react-flip-move'
const Input = ({ type, label, value, onChange, cap, required = false }) => {

    return <FlipMove
        appearAnimation="elevator"
    >

        <div className="input" >
            {type === 'textarea' ? <textarea
                placeholder={label}
                value={value}
                required={required}
                onChange={onChange} /> : <input
                    placeholder={label}
                    required={required}
                    type={type}
                    value={value}
                    onChange={onChange} />}
            <label>{label}</label>

            <style jsx>{`
             .input {
                 margin : 15px 0;
                 position : relative;
                }

                .input textarea , .input input {
                 border-bottom : 1px solid  var(--gray-dark);
                 width : 100%;
                 background : none;
                 transition : all .5s;
                 color : var(--black);
                 position : relative;
                 z-index : 10;
                 text-transform : ${cap ? 'capitalize' : 'unset'};
                 font-weight : bold;
                 padding : 10px 10px 2px;
                }
             ::placeholder {
                 color : transparent
             }
             .input textarea:focus , .input input:focus {
                 border-bottom : 1px solid var(--primary);
                }
                label {
                    font-size : 10px;
                    display : block;
                    color : var(--gray-dark);
                    margin-bottom : 0;
                    position : absolute;
                    top : 0px;
                    left : 10px;
                    z-index : 1;
                    transition : all .5s;
                    text-transform : capitalize;
                }
                input:focus ~ label ,
                textarea:focus ~ label {
                    color : var(--primary)
                }
                input:placeholder-shown ~ label,
                textarea:placeholder-shown ~ label {
                    font-size : 14px;
                 top : 50%;
                 transform : translateY(-50%);
                 font-weight : 600;
                 color : var(--black)
                }
                textarea:placeholder-shown ~ label{
                    top : 20px;
                }
                
                `}</style>
        </div>
    </FlipMove>
}

export default Input