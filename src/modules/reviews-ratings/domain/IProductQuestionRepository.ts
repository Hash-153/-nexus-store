import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { ProductQuestion } from "./ProductQuestion.ts";

export interface IProductQuestionFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IProductQuestionRepository extends IRepository<ProductQuestion> {
  findByName(name: string): Promise<ProductQuestion | null>;
  findByCode?(code: string): Promise<ProductQuestion | null>;
  findFiltered(options?: IProductQuestionFilterOptions): Promise<ProductQuestion[]>;
  count(options?: IProductQuestionFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: ProductQuestion[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
