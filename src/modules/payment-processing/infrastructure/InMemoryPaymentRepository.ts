import { InMemoryRepository } from "../../../shared/infrastructure/Repository.ts";
import { Payment } from "../domain/Payment.ts";
import type { IPaymentRepository } from "../domain/IPaymentRepository.ts";

export class InMemoryPaymentRepository extends InMemoryRepository<Payment> implements IPaymentRepository {
  public async findByOrderId(orderId: string): Promise<Payment[]> {
    return Array.from(this.items.values()).filter((p) => p.orderId === orderId);
  }

  public async findByTransactionReference(ref: string): Promise<Payment | null> {
    for (const p of this.items.values()) {
      if (p.transactionReference === ref) {
        return p;
      }
    }
    return null;
  }
}
