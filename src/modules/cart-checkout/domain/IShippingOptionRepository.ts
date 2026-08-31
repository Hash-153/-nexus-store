import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { ShippingOption } from "./ShippingOption.ts";

export interface IShippingOptionFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IShippingOptionRepository extends IRepository<ShippingOption> {
  findByName(name: string): Promise<ShippingOption | null>;
  findByCode?(code: string): Promise<ShippingOption | null>;
  findFiltered(options?: IShippingOptionFilterOptions): Promise<ShippingOption[]>;
  count(options?: IShippingOptionFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: ShippingOption[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
