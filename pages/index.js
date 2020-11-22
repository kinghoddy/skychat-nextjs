import React, { useState } from 'react'
import Feed from '../components/Feed/Feed';
import Home from '../Home/Home';
import 'firebase/auth';
import firebase from '../firebase'

function Skychat() {
  const [userExists, setUserExists] = useState(false)
  React.useEffect(() => {
    let hasUsed = localStorage.getItem('hasUsedSkychat');
    if (hasUsed) setUserExists(true);
    else setUserExists(false)
  }, []);

  return userExists ? <Feed /> : <Home />
}

export default Skychat
