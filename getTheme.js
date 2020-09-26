const theme = {
    getTheme: function () {
        let t = localStorage.getItem('skychatTheme');
        if (t) {
            document.body.className = '';
            var metaThemeColor = document.querySelector("meta[name=theme-color]");
            document.body.classList.add(t);
            metaThemeColor.setAttribute("content", t === 'dark' ? '#111' : t === 'dim' ? '#1a2e3d' : '#fff');
        }
        return t
    },
    setTheme: function (t) {
        var metaThemeColor = document.querySelector("meta[name=theme-color]");
        document.body.className = '';
        metaThemeColor.setAttribute("content", t === 'dark' ? '#111' : t === 'dim' ? '#1a2e3d' : '#fff');
        document.body.classList.add(t);
        return localStorage.setItem('skychatTheme', t)
    }
}

export default theme