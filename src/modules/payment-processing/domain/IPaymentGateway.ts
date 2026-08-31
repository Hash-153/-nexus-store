import { Money } from "../../../shared/domain/value-objects/Money.ts";
import { PaymentMethod } from "./PaymentStatus.ts";

export interface PaymentGatewayRequest {
  amount: Money;
  method: PaymentMethod;
  paymentDetails: {
    token?: string;
    cardNumberMasked?: string;
    cardHolderName?: string;
  };
}

export interface PaymentGatewayResponse {
  success: boolean;
  transactionReference?: string;
  errorMessage?: string;
}

export interface IPaymentGateway {
  charge(request: PaymentGatewayRequest): Promise<PaymentGatewayResponse>;
  refund(transactionReference: string, amount: Money): Promise<PaymentGatewayResponse>;
}
