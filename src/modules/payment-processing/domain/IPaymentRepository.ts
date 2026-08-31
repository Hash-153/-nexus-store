import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { Payment } from "./Payment.ts";

export interface IPaymentRepository extends IRepository<Payment> {
  findByOrderId(orderId: string): Promise<Payment[]>;
  findByTransactionReference(ref: string): Promise<Payment | null>;
}
