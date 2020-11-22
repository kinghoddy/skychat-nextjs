importScripts('https://www.gstatic.com/firebasejs/7.14.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.0/firebase-database.js');

var firebaseConfig = {
    apiKey: "AIzaSyCKMoKc1Cft0WG1etZLvnmh5ytzdckkIcg",
    authDomain: "skymail-920ab.firebaseapp.com",
    databaseURL: "https://skymail-920ab.firebaseio.com",
    projectId: "skymail-920ab",
    storageBucket: "skymail-920ab.appspot.com",
    messagingSenderId: "795125035544",
    appId: "1:795125035544:web:bc6cddb5e006c3bfdd496d",
    measurementId: "G-Z3K3MYS9NC"
};
firebase.initializeApp(firebaseConfig);

self.addEventListener("fetch", function (event) {
});
// self.registration.showNotification('hi')
self.addEventListener('notificationclose', function (e) {
    var notification = e.notification;
    var data = notification.data;
    console.log('Closed notification: ' + data);
    if (data.type === 'notification') {
        firebase.database().ref('users/' + data.uid + '/notification/' + data.notificationKey + '/seen').set(Date.now());
    }
});
self.addEventListener('notificationclick', function (e) {
    var notification = e.notification;
    var data = notification.data;
    var action = e.action;
    const promiseChain = (url) => clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    }).then((windowClients) => {
        const urlToOpen = new URL(url, self.location.origin).href;
        console.log(urlToOpen);
        let matchingClient = null;
        for (let i = 0; i < windowClients.length; i++) {
            const windowClient = windowClients[i];
            console.log(windowClient);
            if (windowClient.url.indexOf(urlToOpen) > -1) {
                matchingClient = windowClient;
                break;
            }
        }
        if (matchingClient) {
            return matchingClient.focus();
        } else {
            return clients.openWindow(urlToOpen);
        }
    });

    console.log('clicked notification: ', notification);
    if (data.type === 'notification') {
        if (action === 'close') {
            notification.close();
        } else if (action === 'viewPost') {
            // clients.openWindow(self.origin + '/' + data.pid);
            e.waitUntil(promiseChain('/' + data.pid));
            notification.close();
        } else {
            e.waitUntil(promiseChain('/feed'));
            notification.close();
        };
        firebase.database().ref('users/' + data.uid + '/notification/' + data.notificationKey + '/seen').set(Date.now());
    } else if (data.type === 'call') {
        console.log('incoing call');
        e.waitUntil(promiseChain('/'));
        notification.close();
    }


});
