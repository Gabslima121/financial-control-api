import { PaymentDestinationsDomain } from '../domain/payment-destinations/payment-destinations.domain';

export interface PaymentDestinationPort {
  createPaymentDestination(
    paymentDestination: PaymentDestinationsDomain,
  ): Promise<PaymentDestinationsDomain>;
  listPaymentDestinationByUser(
    userId: string,
  ): Promise<PaymentDestinationsDomain[]>;
}
