import createStripe from 'stripe'

export const stripe = new createStripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2020-08-27',
})


export const createProductWithPrice = async (totalWithTax: number) => {
  const product = await stripe.products.create({
    name: 'Nákup na LOOdesign.store',
  })
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: totalWithTax,
    currency: 'czk',
  })
  return price
}

export const createStripeSession = async (
  returnHost: string,
  price: createStripe.Response<createStripe.Price>
) => {
  const stripeReturnUrl = `https://${returnHost}/checkout`
  const session = await stripe.checkout.sessions.create({
    line_items: [{ price: price.id, quantity: 1 }],
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${stripeReturnUrl}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${stripeReturnUrl}/?canceled=true`,
  })
  return session
}
