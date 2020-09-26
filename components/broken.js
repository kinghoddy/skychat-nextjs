import React from 'react';
import Link from 'next/link'

const Broken = props => {
    return <div className="text-center p-4" >
        <i className="icon fad fa-key" />
        <i className="icon fad fa-user-lock text-warning" />
        <h4>This Content Isn't Available Right Now</h4>
        <p>
            When this happens, it's usually because you followed a broken link or the content has been deleted
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