import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { BundleDiscount } from "./BundleDiscount.ts";

export interface IBundleDiscountFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IBundleDiscountRepository extends IRepository<BundleDiscount> {
  findByName(name: string): Promise<BundleDiscount | null>;
  findByCode?(code: string): Promise<BundleDiscount | null>;
  findFiltered(options?: IBundleDiscountFilterOptions): Promise<BundleDiscount[]>;
  count(options?: IBundleDiscountFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: BundleDiscount[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
