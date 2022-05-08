import { CommerceAPI, createEndpoint, GetAPISchema } from '@commerce/api'
import { CheckoutSchema } from '@commerce/types/checkout'
import checkoutEndpoint from '@commerce/api/endpoints/checkout'
import {
  ActiveOrder,
  activeOrderQuery,
  addPaymentToOrderQuery,
  setCustomerForOrderQuery,
  setShippingAddressForOrderQuery,
  setOrderToArrangingPaymentQuery,
} from './queries'
import { createProductWithPrice, createStripeSession, stripe } from './stripe'

const getCheckout: CheckoutEndpoint['handlers']['getCheckout'] = async ({
  req,
  res,
  config,
}) => {
  try {
    const fetchOptions = { headers: { cookie: req.headers.cookie! } }
    const requestUrl = req.url!
    if (req.url!.includes('success')) {
      const sessionId = new URLSearchParams('?' + requestUrl.split('?')[1]).get(
        'session_id'
      )
      const successSession = await stripe.checkout.sessions.retrieve(sessionId!)

      console.log(successSession)

      // Set customer for order
      // const { data, res: resp } = await config.fetch(
      //   setCustomerForOrderQuery,
      //   {},
      //   fetchOptions
      // )
      // console.log(data, resp)

      // // Set shipping address for order
      // await config.fetch(setShippingAddressForOrderQuery, {}, fetchOptions)

      // // Mutate order to ArrangingPayment
      // await config.fetch(setOrderToArrangingPaymentQuery, {}, fetchOptions)

      // // Add payment to order
      await config.fetch(addPaymentToOrderQuery, {}, fetchOptions)

      res.send({ data: 'success boii' })
      return
    }

    const { data } = await config.fetch<ActiveOrder>(
      activeOrderQuery,
      {},
      fetchOptions
    )

    const price = await createProductWithPrice(data.activeOrder.totalWithTax)

    const session = await createStripeSession(req.headers.host!, price)

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
