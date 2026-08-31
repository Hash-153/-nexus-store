import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { TransferOrder } from "./TransferOrder.ts";

export interface ITransferOrderFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ITransferOrderRepository extends IRepository<TransferOrder> {
  findByName(name: string): Promise<TransferOrder | null>;
  findByCode?(code: string): Promise<TransferOrder | null>;
  findFiltered(options?: ITransferOrderFilterOptions): Promise<TransferOrder[]>;
  count(options?: ITransferOrderFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: TransferOrder[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
