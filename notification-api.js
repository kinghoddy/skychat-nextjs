function requestNotPermission() {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        return false
    }
    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        return true
    }
    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
        return requestNot()
    } else {
        alert(error)
        console.log('error has oco');
    }
}
const requestNot = () => {
    Notification.requestPermission().then(function (permission) {
        // If the user accepts, let's create a notification
        let con = false
        if (permission === "granted") {
            con = true;
        }
        return con
    })
}
const presentNot = (title, opt) => {
    const options = {
        icon: '/img/logo/icon-512.png',
        badge: '/img/logo/logo_red.png',

        ...opt
    }
    return navigator.serviceWorker.getRegistration('/service-worker.js').then((reg) => {
        reg.showNotification(title, options)
    }).catch((error) => {
        console.log(error, 'error  fetching worker');
    })
}

export { requestNotPermission, presentNot }