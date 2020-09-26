import React from 'react';
import ProfilePicture from '../UI/profilePicture';
const Comment = props => {
    const [text, setText] = React.useState('');
    const [userData, setUserData] = React.useState({})
    const editor = React.useRef()

    React.useEffect(() => {
        document.execCommand("defaultParagraphSeparator", false, "div");
        const ud = JSON.parse(localStorage.getItem('skychatUserData'))

        if (ud) setUserData(ud);


    }, []);
    React.useEffect(() => {
        if (props.initValue) {
            editor.current.onfocus = e => {
                setText(props.initValue);
                editor.current.innerText = props.initValue;
            }
        }

        if (props.focus) editor.current.focus();

    }, [props.focus, props.initValue])
    // submit
    const submit = e => {
        e.preventDefault();
        const t = document.createElement('div');
        t.innerHTML = text;
        if (t.innerText.length > 0) {
            props.submit(e, text);
            editor.current.innerHTML = null;
            setText('')
        } else {
            editor.current.innerHTML = null;
            setText('')
            editor.current.focus()
        }
    }
    const paste = e => {
        e.preventDefault();
        // get text representation of clipboard
        var text = (e.originalEvent || e).clipboardData.getData('text/plain');
        // insert text manually
        document.execCommand("insertHTML", false, text);
    }

    return <div className="con" >
        <form onSubmit={submit} className="textForm" >
            <ProfilePicture online={true} size="30px" src={userData.profilePicture} />
            <div className="text ml-2">
                {!text && <div className="placeholder" >Add a comment...</div>}
                <div onBlur={props.onBlur} ref={editor} className="editor" onPaste={paste} contentEditable={true} onInput={e => setText(e.target.innerHTML)}>
                </div>
            </div>
            <button className="send" >
                <i className="material-icons" >send</i>
            </button>
        </form>
        <style jsx>{`
           .con {
               display : flex;
               align-items : flex-end;
               min-height : 100%;
               padding : 10px;
           }
           .textForm {
               display : flex;
               flex : 1;
               height :100%;
               width : 100%;
               align-items : flex-end;
            }
            .text::scrollbar {
                height : 10px;
            }
           .text {
            font-size: 15px;
            position : relative;
            flex : 1;
            background : var(--white);
            align-self : stretch;
            border-radius : 30px;
            background : var(--gray);
            padding : 5px 15px;
            }
            .placeholder {
                position:absolute;
                top: 50%;
                color : var(--gray-dark);
                left :15px;
                transform : translateY(-50%);
            } 
                .editor::-webkit-scrollbar {
                    width : 5px;
                }

            .editor {
                position : relative;
                z-index: 100;
                white-space : pre-line;
                overflow-wrap : break-word; 
                overflow-y : auto;
                word-break:break-all;
                overflow-x : hidden;
                width : 100%;
                max-height : 9rem;
            }
            .send {
                align-items : center;
                display : flex;
                justify-content : center;
               background : var(--secondary);
               border-radius : 50%;
               height : 30px;
               width : 30px;
               color : #f21;
               transition : all .3s;
               margin-left : 10px;
           }
           .send:active {
               background : #f21;
               color : #fff;
           }
           .send i {
              font-size  :20px;
              color : inherit;
           }

        `}</style>
    </div>

}

export default Comment