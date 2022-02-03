import { Product } from '@commerce/types/product'

const HomePage: React.FC<{ products: Product[] }> = ({ products }) => {
  console.log(window.location.search, products)
  return <>Main Content</>
}

export default HomePage
