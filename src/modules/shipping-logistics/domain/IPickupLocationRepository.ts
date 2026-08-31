import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { PickupLocation } from "./PickupLocation.ts";

export interface IPickupLocationFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IPickupLocationRepository extends IRepository<PickupLocation> {
  findByName(name: string): Promise<PickupLocation | null>;
  findByCode?(code: string): Promise<PickupLocation | null>;
  findFiltered(options?: IPickupLocationFilterOptions): Promise<PickupLocation[]>;
  count(options?: IPickupLocationFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: PickupLocation[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
