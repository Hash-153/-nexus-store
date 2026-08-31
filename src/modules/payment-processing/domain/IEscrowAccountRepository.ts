import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { EscrowAccount } from "./EscrowAccount.ts";

export interface IEscrowAccountFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IEscrowAccountRepository extends IRepository<EscrowAccount> {
  findByName(name: string): Promise<EscrowAccount | null>;
  findByCode?(code: string): Promise<EscrowAccount | null>;
  findFiltered(options?: IEscrowAccountFilterOptions): Promise<EscrowAccount[]>;
  count(options?: IEscrowAccountFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: EscrowAccount[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
