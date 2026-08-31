import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { ProductAnswer } from "./ProductAnswer.ts";

export interface IProductAnswerFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IProductAnswerRepository extends IRepository<ProductAnswer> {
  findByName(name: string): Promise<ProductAnswer | null>;
  findByCode?(code: string): Promise<ProductAnswer | null>;
  findFiltered(options?: IProductAnswerFilterOptions): Promise<ProductAnswer[]>;
  count(options?: IProductAnswerFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: ProductAnswer[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
