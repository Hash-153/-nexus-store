import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { CheckoutSession } from "./CheckoutSession.ts";

export interface ICheckoutSessionFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ICheckoutSessionRepository extends IRepository<CheckoutSession> {
  findByName(name: string): Promise<CheckoutSession | null>;
  findByCode?(code: string): Promise<CheckoutSession | null>;
  findFiltered(options?: ICheckoutSessionFilterOptions): Promise<CheckoutSession[]>;
  count(options?: ICheckoutSessionFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: CheckoutSession[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
