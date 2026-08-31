import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { Warehouse } from "./Warehouse.ts";

export interface IWarehouseFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IWarehouseRepository extends IRepository<Warehouse> {
  findByName(name: string): Promise<Warehouse | null>;
  findByCode?(code: string): Promise<Warehouse | null>;
  findFiltered(options?: IWarehouseFilterOptions): Promise<Warehouse[]>;
  count(options?: IWarehouseFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: Warehouse[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
