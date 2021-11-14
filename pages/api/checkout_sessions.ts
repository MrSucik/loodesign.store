import createStripe from 'stripe'

const stripe = new createStripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2020-08-27',
})

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    try {
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
        success_url: `${req.headers.origin}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
      })
      res.redirect(303, session.url)
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message)
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}
