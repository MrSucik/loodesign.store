import { CommerceAPI, createEndpoint, GetAPISchema } from '@commerce/api'
import { CheckoutSchema } from '@commerce/types/checkout'
import checkoutEndpoint from '@commerce/api/endpoints/checkout'
import { ActiveOrder, activeOrderQuery } from './activeOrder'
import { createProductWithPrice, createStripeSession, stripe } from './stripe'

const getCheckout: CheckoutEndpoint['handlers']['getCheckout'] = async ({
  req,
  res,
  config,
}) => {
  try {
    const requestUrl = req.url!
    console.log(requestUrl)
    if (req.url!.includes('success')) {
      const sessionId = new URLSearchParams('?' + requestUrl.split('?')[1]).get(
        'session_id'
      )
      console.log(
        'Success: ',
        await stripe.checkout.sessions.retrieve(sessionId!)
      )
    }

    const { data } = await config.fetch<ActiveOrder>(
      activeOrderQuery,
      {},
      { headers: { cookie: req.headers.cookie! } }
    )

    const price = await createProductWithPrice(data.activeOrder.totalWithTax)

    const session = await createStripeSession(req.headers.host!, price)

    console.log('Session ID: ', session.id)
    console.log('Payment status: ', session.payment_status)

    res.redirect(session.url!)
  } catch (error) {
    console.error(error)

    const message = 'An unexpected error ocurred'

    res.status(500).json({ data: null, errors: [{ message }] })
  }
}

const submitCheckout: CheckoutEndpoint['handlers']['submitCheckout'] = async ({
  req,
  res,
  config,
}) => {
  try {
    console.log('Submit checkout', req)
    res.send({ data: null, errors: [{ message: 'success' }] })
  } catch (error) {
    console.error(error)

    const message = 'An unexpected error ocurred'

    res.status(500).json({ data: null, errors: [{ message }] })
  }
}

export type CheckoutAPI = GetAPISchema<CommerceAPI, CheckoutSchema>

export type CheckoutEndpoint = CheckoutAPI['endpoint']

export const handlers: CheckoutEndpoint['handlers'] = {
  getCheckout,
  submitCheckout,
}

const checkoutApi = createEndpoint<CheckoutAPI>({
  handler: checkoutEndpoint,
  handlers,
})

export default checkoutApi
