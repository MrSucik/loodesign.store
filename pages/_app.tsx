import '@assets/main.css'
import '@assets/chrome-bug.css'
import 'keen-slider/keen-slider.min.css'

import { FC, useEffect } from 'react'
import type { AppProps } from 'next/app'
import { Head } from '@components/common'
import { ManagedUIContext } from '@components/ui/context'

const Noop: FC = ({ children }) => <>{children}</>

export default function MyApp({ Component, pageProps }: AppProps) {
  const Layout = (Component as any).Layout || Noop

  useEffect(() => document.body.classList?.remove('loading'), [])
  return (
    <>
      <Head />
      <ManagedUIContext>
        <Layout pageProps={pageProps}>
          <Component {...pageProps} />
        </Layout>
      </ManagedUIContext>
      <script type="text/javascript">
        var sc_project=11426063; var sc_invisible=1; var sc_security="9cf59078";
      </script>
      <script
        type="text/javascript"
        src="https://www.statcounter.com/counter/counter.js"
        async
      ></script>
    </>
  )
}
