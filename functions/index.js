const functions = require('firebase-functions');
const admin = require('firebase-admin')

admin.initializeApp(functions.config().firebase)



// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
const creatNot = (not, arr) => {
    arr.forEach(cur => {
        return admin.database().ref('users/' + cur + '/notification').push(not)
            .then(doc => console.log('notification added', cur, not))
    })

}




exports.postCreated = functions.database.ref('posts/{postId}').onCreate((doc, context) => {
    const post = doc.val();
    const notification = {
        icon: post.icon,
        title: '<b>' + post.username + '</b> added a post',
        date: Date.now(),
        link: 'post/' + context.params.postId
    }
    if (post.type === 'shared') notification.title = '<b>' + post.username + '</b> shared <b>' + post.sharedFrom.username + "'s</b> post"
    if (post.media && post.media[0].type === 'image') notification.icon = post.media[0].src

    return admin.database().ref('users/' + context.auth.uid).once('value', s => {
        const friends = s.val().friendsId;
        let friendsList = [];
        for (let id in friends) {
            console.log(friends[id]);
            friendsList.push(friends[id])
        }
        return creatNot(notification, friendsList)

    })
})

