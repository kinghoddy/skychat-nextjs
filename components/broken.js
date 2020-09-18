import React from 'react';
import Link from 'next/link'

const Broken = props => {
    return <div className="text-center p-4" >
        <i className="icon fad fa-key" />
        <i className="icon fad fa-user-lock text-warning" />
        <h4>This Content Isn't Available Right Now</h4>
        <p>
            When this happens, it's usually because the owner only shared it with a small group of people, changed who can see it or it's been deleted
        </p>
        <Link href="/feed">
            <a className="btn btn-fav" >Got to News Feed</a>
        </Link>
        <style jsx>{`
          .icon {
              font-size : 70px;
              color : orangered;
              margin-bottom : 20px
          }
        `}</style>
    </div>
}
export default Broken