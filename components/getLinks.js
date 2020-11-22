import React from 'react'

const getIvLinks = (ref = document, callBack) => {

    const links = Array.from(ref.querySelectorAll('a'));
    let id = null
    links.forEach(cur => {

        const link = cur.href.match(/https\:\/\/skychat\.(.*?)\/j\/(.*?)$/)
        if (link) {
            cur.onclick = e => {
                e.preventDefault();
                (callBack && callBack(id))
            }
            id = cur.href
        }

    });
    return id
}

const fetchMetaData = async (ref) => {
    const link = Array.from(ref.querySelectorAll('a'))[0];
    if (link) {
        let result = null
        let fetched = true
        let t = await fetch(link.href).catch(() => {
            fetched = false
        })
        if (!fetched) t = await fetch('https://cors-anywhere.herokuapp.com/' + link.href)

        const res = await t.text();
        result = {};
        let dom = document.createElement('html');
        dom.innerHTML = res;
        let r = {
            title: () => {
                try {
                    return dom.querySelector("meta[property='og:title']").content;
                } catch (error) {
                    return dom.querySelector('title').innerText;
                }
            },
            description: () => {
                try {
                    return dom.querySelector("meta[property='og:description']").content;
                } catch (error) {
                    try {
                        return dom.querySelector("meta[name='description']").content;

                    } catch (error) {
                        return null
                    }
                }
            },
            image: () => {
                try {
                    let url = dom.querySelector("meta[property='og:image']").content;
                    url = new URL(url, link.href)
                    return url
                } catch (error) {
                    return null;
                }
            }
        };
        result = {
            title: r.title(),
            description: r.description(),
            image: r.image(),
        };
        return result
    } else return null
}

function CheckInvite() {
    React.useEffect(() => {
        getLinks(document, getGroup)
    }), []

    const getGroup = (id) => {
        console.log(id);
    }
    return (
        <div>

        </div>
    )
}


export { getIvLinks, fetchMetaData }
export default CheckInvite;
