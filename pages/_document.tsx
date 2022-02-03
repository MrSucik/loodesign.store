import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body className="loading">
          <Main />
          <NextScript />
          <script type="text/javascript">
            var sc_project=11426063; var sc_invisible=1; var
            sc_security="9cf59078";
          </script>
          <script
            type="text/javascript"
            src="https://www.statcounter.com/counter/counter.js"
            async
          ></script>
        </body>
      </Html>
    )
  }
}

export default MyDocument
