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
  mutation setCustomer(
    $title: String
    $firstName: String!
    $lastName: String!
    $emailAddress: String!
    $phoneNumber: String
  ) {
    setCustomerForOrder(
      input: {
        title: $title
        firstName: $firstName
        lastName: $lastName
        emailAddress: $emailAddress
        phoneNumber: $phoneNumber
      }
    ) {
      __typename
    }
  }
`

export const setShippingAddressForOrderQuery = /* GraphQL */ `
  mutation setShipping(
    $fullName: String
    $streetLine1: String!
    $phoneNumber: String
    $city: String
    $countryCode: String!
  ) {
    setOrderShippingAddress(
      input: {
        fullName: $fullName
        streetLine1: $streetLine1
        phoneNumber: $phoneNumber
        city: $city
        countryCode: $countryCode
      }
    ) {
      __typename
    }
  }
`
