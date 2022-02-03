import { CommerceAPI, createEndpoint, GetAPISchema } from '@commerce/api'
import { CheckoutSchema } from '@commerce/types/checkout'
import checkoutEndpoint from '@commerce/api/endpoints/checkout'
import createStripe from 'stripe'

const activeOrderQuery = /* GraphQL */ `
  query activeOrder {
    activeOrder {
      id
      totalWithTax
    }
  }
`
const stripe = new createStripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2020-08-27',
})

const getCheckout: CheckoutEndpoint['handlers']['getCheckout'] = async ({
  req,
  res,
  config,
}) => {
  try {
    const requestCookie = req.headers.cookie as string
    const response = await config.fetch(
      activeOrderQuery,
      {},
      { headers: { cookie: requestCookie } }
    )

    const product = await stripe.products.create({ name: 'Test product' })
    // Generate price
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 2000,
      currency: 'czk',
    })

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (e.g. pr_1234) of the product you want to sell
          price: price.id,
          quantity: 1,
        },
      ],
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `/?canceled=true`,
    })

    console.log(session, req.headers)

    res.send(response)
  } catch (error) {
    console.error(error)

    const message = 'An unexpected error ocurred'

    res.status(500).json({ data: null, errors: [{ message }] })
  }
}

export type CheckoutAPI = GetAPISchema<CommerceAPI, CheckoutSchema>

export type CheckoutEndpoint = CheckoutAPI['endpoint']

export const handlers: CheckoutEndpoint['handlers'] = { getCheckout }

const checkoutApi = createEndpoint<CheckoutAPI>({
  handler: checkoutEndpoint,
  handlers,
})

export default checkoutApi
