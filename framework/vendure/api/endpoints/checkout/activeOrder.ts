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
