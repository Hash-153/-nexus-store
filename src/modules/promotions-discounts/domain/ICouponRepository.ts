import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { Coupon } from "./Coupon.ts";

export interface ICouponFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ICouponRepository extends IRepository<Coupon> {
  findByName(name: string): Promise<Coupon | null>;
  findByCode?(code: string): Promise<Coupon | null>;
  findFiltered(options?: ICouponFilterOptions): Promise<Coupon[]>;
  count(options?: ICouponFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: Coupon[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
