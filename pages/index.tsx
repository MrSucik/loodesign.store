import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { Product } from '@commerce/types/product'

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const productsPromise = commerce.getAllProducts({
    variables: { first: 6 },
    config,
    preview,
    // Saleor provider only
    ...({ featured: true } as any),
  })
  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const { products } = await productsPromise
  const { pages } = await pagesPromise
  const { categories, brands } = await siteInfoPromise

  return {
    props: {
      products,
      categories,
      brands,
      pages,
    },
    revalidate: 60,
  }
}

const HomePage: React.FC<{ products: Product[] }> = ({ products }) => {
  console.log(window.location.search, products)
  return <>Main Content</>
}

export default function Home({
  products,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return <HomePage products={products} />
}

Home.Layout = Layout
