import Document, { Html, Head, Main, NextScript } from "next/document";
export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }
  render() {
    return (
      <Html>
        <Head>
          <meta name="author" content="Sogbuyi Noel Odunmilade" />
          <meta name="keywords" content="skychat kinghoddy sky-chat" />
          <meta name="msapplication-TileColor" content="#ffa600" />
          <meta name="msapplication-TileImage" content="/img/logo/logo_red.png" />
          <meta name="theme-color" content="#ffffff" />

          <link rel="stylesheet" href="/css/bootstrap.min.css" />
          <link rel="stylesheet" href="/index.css" />
          <link rel="stylesheet" href="/css/animate.min.css" />
          <link rel="stylesheet" href="/fontawesome/css/fontawesome.min.css" />
          <link rel="stylesheet" href="/fontawesome/css/all.min.css" />
          <link rel="stylesheet" href="/iconfont/material-icons.css" />
          <meta name="google-site-verification" content="9vMTNI71ICLn3Vg-lD07eLxkPFM7fgdLxXLVp0ZOnEg" />          <link rel="manifest" href="/manifest.json" />
          <script src="/js/jquery.js"></script>
          <script src="/js/bootstrap.min.js"></script>
          <script src="/js/wow.min.js"></script>
          <link
            href="https://fonts.googleapis.com/css?family=Architects+Daughter|Gochi+Hand|Montserrat+Alternates:200,300,400,500,700,800|Source+Sans+Pro&display=swap"
            rel="stylesheet"
          />
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600;700&display=swap" rel="stylesheet" />

        </Head>
        <body >
          <Main />
          <NextScript />
        </body>
        <script src="/js/main.js"></script>
      </Html>
    );
  }
}
