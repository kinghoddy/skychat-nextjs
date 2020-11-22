import React from 'react';
import firebase from '../firebase';
import 'firebase/database'
const EXTERNAL_DATA_URL = 'https://skychat.tk/posts';
const createSitemap = (posts, users) => `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${Object.keys(posts)
        .map((id) => {
            return `
                    <url>
                        <loc>${`${EXTERNAL_DATA_URL}/${id}`}</loc>
                    </url>
                `;
        })
        .join('')}
                ${Object.values(users)
        .map((user) => {
            return `
                    <url>
                        <loc>${`https://skychat.tk/${user.username}`}</loc>
                    </url>
                `;
        })
        .join('')}
                 <url>
                        <loc>https://skychat.tk</loc>
                    </url>
                 <url>
                        <loc>https://skychat.tk/messages</loc>
                    </url>
    </urlset>
    `;
class Sitemap extends React.Component {
    static async getInitialProps({ res }) {
        const request = await firebase.database().ref('posts/').once('value');
        const u = await firebase.database().ref('users/').once('value');
        const posts = await request.toJSON();
        const users = await u.toJSON();
        res.setHeader('Content-Type', 'text/xml');
        res.write(createSitemap(posts, users));
        res.end();
    }
}

export default Sitemap;