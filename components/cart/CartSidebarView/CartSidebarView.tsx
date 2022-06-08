import cn from 'classnames'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
import s from './CartSidebarView.module.css'
import CartItem from '../CartItem'
import { Button, Text } from '@components/ui'
import { useUI } from '@components/ui/context'
import { Bag, Cross, Check } from '@components/icons'
import useCart from '@framework/cart/use-cart'
import usePrice from '@framework/product/use-price'
import SidebarLayout from '@components/common/SidebarLayout'

const CartSidebarView: FC = () => {
  const [checkoutState, setCheckoutState] = useState<'' | 'success' | 'error'>(
    ''
  )
  const { closeSidebar } = useUI()
  useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    const state = query.get('success')
      ? 'success'
      : query.get('canceled')
      ? 'error'
      : ''
    setCheckoutState(state)
  }, [])

  const error = checkoutState === 'error'
  const success = checkoutState === 'success'
  const { data, isLoading, isEmpty } = useCart()

  const { price: subTotal } = usePrice(
    data && {
      amount: Number(data.subtotalPrice),
      currencyCode: data.currency.code,
    }
  )
  const { price: total } = usePrice(
    data && {
      amount: Number(data.totalPrice),
      currencyCode: data.currency.code,
    }
  )
  const handleClose = () => closeSidebar()

  return (
    <SidebarLayout
      className={cn({
        [s.empty]: error || success || isLoading || isEmpty,
      })}
      handleClose={handleClose}
    >
      {error ? (
        <div className="flex-1 px-4 flex flex-col justify-center items-center">
          <span className="border border-white rounded-full flex items-center justify-center w-16 h-16">
            <Cross width={24} height={24} />
          </span>
          <h2 className="pt-6 text-xl font-light text-center">
            Nepodařilo se zprocesovat Vaši objednávku
          </h2>
          <Link href="/">
            <a>
              <Text variant="sectionHeading" onClick={handleClose}>
                Zpět
              </Text>
            </a>
          </Link>
        </div>
      ) : success ? (
        <div className="flex-1 px-4 flex flex-col justify-center items-center">
          <span className="border border-white rounded-full flex items-center justify-center w-16 h-16">
            <Check />
          </span>
          <h2 className="pt-6 text-xl font-light text-center">
            Děkujeme za Vaši objednávku
          </h2>
          <Link href="/">
            <a>
              <Text variant="sectionHeading" onClick={handleClose}>
                Zpět
              </Text>
            </a>
          </Link>
        </div>
      ) : isLoading || isEmpty ? (
        <div className="flex-1 px-4 flex flex-col justify-center items-center">
          <span className="border border-dashed border-primary rounded-full flex items-center justify-center w-16 h-16 p-12 bg-secondary text-secondary">
            <Bag className="absolute" />
          </span>
          <h2 className="pt-6 text-2xl font-bold tracking-wide text-center">
            Váš košík je prázdný
          </h2>
        </div>
      ) : (
        <>
          <div className="px-4 sm:px-6 flex-1">
            <Text variant="sectionHeading">Váš košík</Text>
            <ul className={s.lineItemsList}>
              {data!.lineItems.map((item: any) => (
                <CartItem
                  key={item.id}
                  item={item}
                  currencyCode={data!.currency.code}
                />
              ))}
            </ul>
          </div>

          <div className="flex-shrink-0 px-6 py-6 sm:px-6 sticky z-20 bottom-0 w-full right-0 left-0 bg-accent-0 border-t text-sm">
            <ul className="pb-2">
              <li className="flex justify-between py-1">
                <span>Subtotal</span>
                <span>{subTotal}</span>
              </li>
              <li className="flex justify-between py-1">
                <span>Poštovné</span>
                <span className="font-bold tracking-wide">ZDARMA</span>
              </li>
            </ul>
            <div className="flex justify-between border-t border-accent-2 py-3 font-bold mb-2">
              <span>Celková částka</span>
              <span>{total}</span>
            </div>
            <div>
              <Button href="/checkout" Component="a" width="100%">
                Pokračovat k pokladně ({total})
              </Button>
            </div>
          </div>
        </>
      )}
    </SidebarLayout>
  )
}

export default CartSidebarView
