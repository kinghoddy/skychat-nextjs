import React from 'react'

export default function Messenger({ fontSize = '15px' }) {
    return (
        <div className="brand" > <span>Skychat</span>
            <h4>Messenger</h4>
            <style jsx>{`
                .brand {
                     
                   text-transform : uppercase;
                   font-size  : ${fontSize};
               }
               .brand span {
                   font-size: 1em
               }
               .brand h4 {
                color : #3af;
                margin-bottom : 0;
                font-size : 1.5em
               }
            `}</style>
        </div>
    )
}
