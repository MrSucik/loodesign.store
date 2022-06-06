import { CommerceAPIConfig } from '@commerce/api';
import {
  addPaymentToOrderQuery,
  setCustomerForOrderQuery,
  setShippingAddressForOrderQuery,
  setOrderToArrangingPaymentQuery
} from './queries';
import Stripe from 'stripe';

export class CheckoutHandler {
  private config: CommerceAPIConfig;
  private successSession: Stripe.Response<Stripe.Checkout.Session>;
  private fetchOptions: {};
  private fullName: string;

  constructor(
    config: CommerceAPIConfig,
    successSession: Stripe.Response<Stripe.Checkout.Session>,
    fetchOptions: {}
  ) {
    this.config = config;
    this.successSession = successSession;
    this.fetchOptions = fetchOptions;
    this.fullName = successSession.shipping?.name || '';
  }

  processPaidOrder = async () => {
    await this.setCustomer();

    await this.setShipping();

    await this.moveToArrangingPayment();

    await this.addPayment();
  };

  private setCustomer = async () => {
    const firstName = this.fullName?.split(' ')[0];
    const lastName = this.fullName?.split(' ')[1];
    console.log(
      await this.config.fetch(
        setCustomerForOrderQuery,
        {
          variables: {
            title: '',
            firstName,
            lastName,
            emailAddress: this.successSession.customer_details?.email,
            phoneNumber: this.successSession.customer_details?.phone,
          },
        },
        this.fetchOptions
      )
    );
  };

  private setShipping = async () => {
    // Set shipping address for order
    console.log(
      await this.config.fetch(
        setShippingAddressForOrderQuery,
        {
          variables: {
            fullName: this.fullName,
            streetLine1: this.successSession.shipping?.address?.line1,
            phoneNumber: this.successSession.shipping?.phone,
            city: this.successSession.shipping?.address?.city,
            countryCode: this.successSession.shipping?.address?.country,
          },
        },
        this.fetchOptions
      )
    );
  };

  private moveToArrangingPayment = async () => {
    // Mutate order to ArrangingPayment
    console.log(
      await this.config.fetch(
        setOrderToArrangingPaymentQuery,
        {},
        this.fetchOptions
      )
    );
  };

  private addPayment = async () => {
    // Add payment to order
    console.log(
      await this.config.fetch(addPaymentToOrderQuery, {}, this.fetchOptions)
    );
  };
}
