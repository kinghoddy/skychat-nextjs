import React from 'react';

const Send = props => {
    const [text, setText] = React.useState('')

    React.useEffect(() => {
        document.execCommand("defaultParagraphSeparator", false, "div");
    }, [])
    // submit
    const submit = e => {
        e.preventDefault();
        if (text.trim().length) {
            props.submit(e, text);
            document.querySelector('.editor').innerHTML = null;
            setText('')
        } else {
            document.querySelector('.editor').focus()
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
            <div className="text">
                {!text && <div className="placeholder" >Aa...</div>}
                <div className="editor" onPaste={paste} contentEditable={true} onInput={e => setText(e.target.innerHTML)}>
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
            padding : 10px 20px;
            }
            .placeholder {
                position:absolute;
                top: 50%;
                color : #0007;
                left :20px;
                transform : translateY(-50%);
            } 
                .editor::-webkit-scrollbar {
                    width : 5px;
                }

            .editor {
                white-space : pre-line;
                overflow-wrap : break-word; 
                overflow : auto;
                max-height : 9rem;
            }
            .send {
                align-items : center;
                display : flex;
                justify-content : center;
               background : #0001;
               border-radius : 50%;
               height : 40px;
               width : 40px;
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

export default Send