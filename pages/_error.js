import Layout from '../components/layouts/profile';
import Link from 'next/link'
function Error({ statusCode }) {
    return (
        <Layout>
            <div className="py-5 text-center" >

                <i className="icon fad fa-key" />
                <i className="icon fad fa-user-lock text-warning" />
                <p>
                    {statusCode
                        ? `An error ${statusCode} occurred on server`
                        : 'An error occurred on client'}
                </p>
                <Link href="/feed">
                    <a className="btn btn-fav" >Got to News Feed</a>
                </Link>
            </div>
            <style jsx>{`
          .icon {
              font-size : 70px;
              color : orangered;
              margin-bottom : 20px
          }
        `}</style>
        </Layout>
    )
}

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
}

export default Error