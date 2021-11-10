const commerce = require('./commerce.config.json')
const {
  withCommerceConfig,
  getProviderName,
} = require('./framework/commerce/config')

const provider = commerce.provider || getProviderName()
const isVendure = provider === 'vendure'

module.exports = withCommerceConfig({
  commerce,
  i18n: {
    locales: ['cs-CZ'],
    defaultLocale: 'cs-CZ',
  },
  rewrites() {
    return [
      isVendure && {
        source: '/checkout',
        destination: '/api/checkout',
      },
      // For Vendure, rewrite the local api url to the remote (external) api url. This is required
      // to make the session cookies work.
      isVendure &&
        process.env.NEXT_PUBLIC_VENDURE_LOCAL_URL && {
          source: `${process.env.NEXT_PUBLIC_VENDURE_LOCAL_URL}/:path*`,
          destination: `${process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL}/:path*`,
        },
    ].filter(Boolean)
  },
})

// Don't delete this console log, useful to see the commerce config in Vercel deployments
console.log('next.config.js', JSON.stringify(module.exports, null, 2))
