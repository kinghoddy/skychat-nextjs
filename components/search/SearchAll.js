import React, { useState } from 'react'
import UserList from '../UI/userList';
import firebase from '../../firebase';
import 'firebase/database'
import Spinner from '../UI/Spinner/Spinner';
import Post from '../posts/post';

function SearchAll(props) {

    const [searching, setSearching] = useState(false)
    React.useEffect(() => {
        setSearching(props.loading)
    }, [props.loading])
    React.useEffect(() => {
        console.log(props.posts);
    }, [props.posts])

    return (
        <div className="search_res" >
            {searching && <div style={{ height: '5rem' }} >
                <Spinner fontSize='3px' />
            </div>}
            {!searching && <div className="search_con" >
                <h4>People {props.people.length}</h4>
                {props.people.map(cur => <UserList key={cur.key} {...cur} />)}
            </div>}
            { props.posts === "loading" ? !searching && <div style={{ height: '5rem' }} >
                <Spinner fontSize='3px' />
            </div> : <div className="search_con" >
                    <h4>Posts {props.posts.length}</h4>
                    {props.posts.map((cur, i) => <Post key={cur.id} likeeId={props.userData.uid}  {...cur} />)}
                    {props.posts.length <= 0 && <p>No posts found for {props.query}</p>}

                </div>}
            <style jsx>{`
               .search_con {
                    background :var(--white);
                    margin : 10px;
                    padding : 10px;
                    border-radius : 8px
                }
                .search_con h4 {
                    padding-bottom : 10px;
                    font-size : 16px;
                }
         
            `}</style>
        </div>
    )
}


export default SearchAll
