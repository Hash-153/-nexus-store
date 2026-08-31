import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { PaymentTransaction } from "./PaymentTransaction.ts";

export interface IPaymentTransactionFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IPaymentTransactionRepository extends IRepository<PaymentTransaction> {
  findByName(name: string): Promise<PaymentTransaction | null>;
  findByCode?(code: string): Promise<PaymentTransaction | null>;
  findFiltered(options?: IPaymentTransactionFilterOptions): Promise<PaymentTransaction[]>;
  count(options?: IPaymentTransactionFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: PaymentTransaction[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
