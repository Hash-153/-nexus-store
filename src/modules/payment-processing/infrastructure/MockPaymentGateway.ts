import type { IPaymentGateway, PaymentGatewayRequest, PaymentGatewayResponse } from "../domain/IPaymentGateway.ts";
import { Money } from "../../../shared/domain/value-objects/Money.ts";
import { CryptoUtils } from "../../../shared/infrastructure/CryptoUtils.ts";

export class MockPaymentGateway implements IPaymentGateway {
  private shouldFail: boolean = false;

  public setShouldFail(fail: boolean): void {
    this.shouldFail = fail;
  }

  public async charge(request: PaymentGatewayRequest): Promise<PaymentGatewayResponse> {
    if (this.shouldFail) {
      return {
        success: false,
        errorMessage: "Card declined by issuing bank (Simulated Error)",
      };
    }

    const transactionReference = `txn_${CryptoUtils.generateSecureToken(12)}`;
    return {
      success: true,
      transactionReference,
    };
  }

  public async refund(transactionReference: string, amount: Money): Promise<PaymentGatewayResponse> {
    return {
      success: true,
      transactionReference: `ref_${CryptoUtils.generateSecureToken(12)}`,
    };
  }
}

