import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { PaymentMethodRecord } from "./PaymentMethodRecord.ts";

export interface IPaymentMethodRecordFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IPaymentMethodRecordRepository extends IRepository<PaymentMethodRecord> {
  findByName(name: string): Promise<PaymentMethodRecord | null>;
  findByCode?(code: string): Promise<PaymentMethodRecord | null>;
  findFiltered(options?: IPaymentMethodRecordFilterOptions): Promise<PaymentMethodRecord[]>;
  count(options?: IPaymentMethodRecordFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: PaymentMethodRecord[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
