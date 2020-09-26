import firebase from './firebase';
import 'firebase/messaging';
import 'firebase/database';
import 'firebase/auth'
import * as serviceWorker from './serviceWorker';
import theme from './getTheme';
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then(function (registration) {
            console.log('Registration successful, scope is:', registration.scope);
        }).catch(function (err) {
            console.log('Service worker registration failed, error:', err);
        });
}
serviceWorker.register();
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        firebase.database().ref('users/' + user.uid).once('value', s => {
            if (s.val()) {
                messaging(user)
                checkConnection(user)
            }
        })
    }
})
const messaging = (user) => {
    const messaging = firebase.messaging()
    messaging.requestPermission()
        .then(res => messaging.getToken())
        // .then(token => firebase.database().ref('tokens/').push({
        //     token: token,
        //     uid: user.uid
        // })
        //     .then(() => {
        //         console.log(token);

        //     }))
        .catch(error => {
            console.log(error);
        })
    messaging.onMessage((payload) => {
        console.log('Message received. ', payload);
        // ...
    });
}

const checkConnection = (user) => {
    // since I can connect from multiple devices or browser tabs, we store each connection instance separately
    // any time that connectionsRef's value is null (i.e. has no children) I am offline
    var myConnectionsRef = firebase.database().ref('users/' + user.uid + '/connections');
    // stores the timestamp of my last disconnect (the last time I was seen online)
    var lastOnlineRef = firebase.database().ref('users/' + user.uid + '/lastOnline');
    var connectedRef = firebase.database().ref('.info/connected');
    connectedRef.on('value', function (snap) {
        if (snap.val() === true) {
            // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
            var con = myConnectionsRef;

            // When I disconnect, remove this device
            con.onDisconnect().remove();

            // Add this device to my connections list
            // this value could contain info about the device or a timestamp too
            con.set(true);

            // When I disconnect, update the last time I was seen online
            lastOnlineRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
        }
    });
}

theme.getTheme()