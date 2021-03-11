const newRoomEndpoint =
    "https://fu6720epic.execute-api.us-west-2.amazonaws.com/default/dailyWwwApiDemoNewCall";
// 'a9d7d0db9dc8cc7c7718146259a3d04e2ca82aad71f69d93fa54a66555d80e28'

/**
 * Create a short-lived room for demo purposes.
 *
 * IMPORTANT: this is purely a "demo-only" API, and *not* how we recommend
 * you create rooms in real production code. In your code, we recommend that you:
 * - Create rooms by invoking the Daily.co REST API from your own backend server
 *   (or from the Daily.co dashboard if you're OK with creating rooms manually).
 * - Pass an "exp" (expiration) parameter to the Daily.co REST endpoint so you
 *   don't end up with a huge number of live rooms.
 *
 * See https://docs.daily.co/reference#create-room for more information on how
 * to use the Daily.co REST API to create rooms.
 */
async function createRoom() {
    // let response = await fetch(newRoomEndpoint),
    //     room = await response.json();
    // return room;

    // Comment out the above and uncomment the below, using your own URL
    return { url: "https://skychat.daily.co/hello" };
}

export default { createRoom };
// https://github.com/mgks/Android-SmartWebView