import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { RefundTransaction } from "./RefundTransaction.ts";

export interface IRefundTransactionFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IRefundTransactionRepository extends IRepository<RefundTransaction> {
  findByName(name: string): Promise<RefundTransaction | null>;
  findByCode?(code: string): Promise<RefundTransaction | null>;
  findFiltered(options?: IRefundTransactionFilterOptions): Promise<RefundTransaction[]>;
  count(options?: IRefundTransactionFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: RefundTransaction[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
