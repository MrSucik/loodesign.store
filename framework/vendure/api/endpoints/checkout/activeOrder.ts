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
      input: { method: "stripe-payment-provider", metadata: { test: "asd" } }
    ) {
      __typename
    }
  }
`

export const transistionOrderToStateQuery = /* GraphQL */ `
  mutation transitionOrderToState {
    transitionOrderToState(state: "ArrangingPayment") {
      __typename
    }
  }
`
