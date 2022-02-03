export interface ActiveOrder {
  activeOrder: {
    id: string
    totalWithTax: number
  }
}

export const activeOrderQuery = /* GraphQL */ `
  query activeOrder {
    activeOrder {
      id
      totalWithTax
    }
  }
`

export const addPaymentToOrderQuery = /* GraphQL */ `
  mutation addPayment {
    addPaymentToOrder(
      input: { method: "stripe-payment-method", metadata: { test: "asd" } }
    ) {
      __typename
    }
  }
`
