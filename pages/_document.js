import Document, { Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <html>
        <Head>
          <meta name="author" content="Sogbuyi Noel Odunmilade" />
          <meta name="keywords" content="skychat kinghoddy sky-chat" />
          <meta name="theme-color" content="#222" />
          <link rel="stylesheet" href="/css/bootstrap.min.css" />
          <link rel="stylesheet" href="/index.css" />
          <link rel="stylesheet" href="/css/animate.min.css" />
          <link rel="stylesheet" href="/fontawesome/css/fontawesome.min.css" />
          <link rel="stylesheet" href="/fontawesome/css/all.min.css" />
          <link rel="stylesheet" href="/iconfont/material-icons.css" />
          <link
            rel="stylesheet"
            href="/device-mockups/device-mockups.min.css"
          />

          <script src="/js/jquery.js"></script>
          <script src="/js/bootstrap.min.js"></script>
          <script src="/js/wow.min.js"></script>
          <link
            href="https://fonts.googleapis.com/css?family=Montserrat:400,700"
            rel="stylesheet"
            type="text/css"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Kaushan+Script"
            rel="stylesheet"
            type="text/css"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Droid+Serif:400,700,400italic,700italic"
            rel="stylesheet"
            type="text/css"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Roboto+Slab:400,100,300,700"
            rel="stylesheet"
            type="text/css"
          />
        </Head>
        <body>
          <Main />

          <NextScript />
        </body>
        <script src="/js/main.js"></script>
        <script async src="https://static.addtoany.com/menu/page.js"></script>
      </html>
    );
  }
}
