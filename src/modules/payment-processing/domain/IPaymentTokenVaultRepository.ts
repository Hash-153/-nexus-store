import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { PaymentTokenVault } from "./PaymentTokenVault.ts";

export interface IPaymentTokenVaultFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IPaymentTokenVaultRepository extends IRepository<PaymentTokenVault> {
  findByName(name: string): Promise<PaymentTokenVault | null>;
  findByCode?(code: string): Promise<PaymentTokenVault | null>;
  findFiltered(options?: IPaymentTokenVaultFilterOptions): Promise<PaymentTokenVault[]>;
  count(options?: IPaymentTokenVaultFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: PaymentTokenVault[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
