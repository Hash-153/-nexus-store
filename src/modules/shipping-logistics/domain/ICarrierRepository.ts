import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { Carrier } from "./Carrier.ts";

export interface ICarrierFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ICarrierRepository extends IRepository<Carrier> {
  findByName(name: string): Promise<Carrier | null>;
  findByCode?(code: string): Promise<Carrier | null>;
  findFiltered(options?: ICarrierFilterOptions): Promise<Carrier[]>;
  count(options?: ICarrierFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: Carrier[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
