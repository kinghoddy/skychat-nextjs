
importScripts('https://www.gstatic.com/firebasejs/7.14.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.0/firebase-messaging.js');
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
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging()

messaging.setBackgroundMessageHandler(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/firebase-logo.png'
    };

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});