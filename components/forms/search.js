import React, { useState } from 'react'

function Search(props) {
    const [search, setSearch] = useState('')
    const submit = e => {
        e.preventDefault();
        if (props.onSubmit && search) props.onSubmit(search);
    }
    const changed = e => {
        let s = e.target.value
        setSearch(s)
        if (s.length < 1 && props.cancel) props.cancel()
    }
    return (
        <form onSubmit={submit} className="search" >
            <input type="text" placeholder="Search..." value={search} onChange={changed} />
            <button>
                <i className="fal fa-search"></i>
            </button>
            <style jsx>{`
                         .search {
                       border-radius : 13px;
                       display : flex;
                       background : #ff220022;
                       overflow : hidden;
                       height : 2.5rem;
                       flex-shrink : 0;
                       margin : 10px 15px;
                   }
                   .search > * {
                       align-self : stretch;
                       background : none;
                       color : var(--black);
                       transition : all .3s;
                    }
                    .search input {
                        width : calc(100% - 40px);
                       padding : 0 15px 0 18px;
                   }
                  ::placeholder {
                       color : #777;
                   }
                   .search button {
                       width : 40px;
                   }
                   .search button:hover {
                       background : #ff220044 ;
                   }
   
            `}</style>
            <style jsx global>{`
                            body.dim .search{
                  background : var(--gray);
              }
                  body.dark  ::placeholder {
                       color : #ccc;
                   }
             body.dark .search{
                  background : var(--gray);
              }
            `}</style>
        </form>
    )
}

export default Search
