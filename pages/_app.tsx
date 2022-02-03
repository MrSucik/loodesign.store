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

  useEffect(() => {
    const script1 = document.createElement('script')
    const script2 = document.createElement('script')

    script2.innerHTML =
      'var sc_project=11426063;  var sc_invisible=1; var sc_security="9cf59078";'
    script2.async = true

    script1.src = 'https://www.statcounter.com/counter/counter.js'
    script1.async = true

    document.body.appendChild(script1)
    document.body.appendChild(script2)

    return () => {
      document.body.removeChild(script1)
      document.body.removeChild(script2)
    }
  }, [])

  return (
    <>
      <Head />
      <ManagedUIContext>
        <Layout pageProps={pageProps}>
          <Component {...pageProps} />
        </Layout>
      </ManagedUIContext>
    </>
  )
}
