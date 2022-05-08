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
  mutation addPaymentToOrder {
    addPaymentToOrder(
      input: { method: "stripe-payment-provider", metadata: "{}" }
    ) {
      __typename
    }
  }
`

export const setOrderToArrangingPaymentQuery = /* GraphQL */ `
  mutation transitionOrderToState {
    transitionOrderToState(state: "ArrangingPayment") {
      __typename
    }
  }
`

export const setCustomerForOrderQuery = /* GraphQL */ `
  mutation setCustomer {
    setCustomerForOrder(
      input: {
        firstName: "Daniel"
        lastName: "Suchan"
        emailAddress: "mr.sucik@gmail.com"
        phoneNumber: "777783404"
      }
    ) {
      __typename
    }
  }
`

export const setShippingAddressForOrderQuery = /* GraphQL */ `
  mutation setShipping {
    setOrderShippingAddress(
      input: {
        fullName: "Daniel Suchan"
        streetLine1: "Proskovická 100"
        phoneNumber: "777783404"
        city: "Ostrava"
        countryCode: "CZ"
      }
    ) {
      __typename
    }
  }
`
