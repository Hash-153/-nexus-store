import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { ShippingZone } from "./ShippingZone.ts";

export interface IShippingZoneFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IShippingZoneRepository extends IRepository<ShippingZone> {
  findByName(name: string): Promise<ShippingZone | null>;
  findByCode?(code: string): Promise<ShippingZone | null>;
  findFiltered(options?: IShippingZoneFilterOptions): Promise<ShippingZone[]>;
  count(options?: IShippingZoneFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: ShippingZone[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
