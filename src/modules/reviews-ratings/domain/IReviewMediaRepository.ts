import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { ReviewMedia } from "./ReviewMedia.ts";

export interface IReviewMediaFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IReviewMediaRepository extends IRepository<ReviewMedia> {
  findByName(name: string): Promise<ReviewMedia | null>;
  findByCode?(code: string): Promise<ReviewMedia | null>;
  findFiltered(options?: IReviewMediaFilterOptions): Promise<ReviewMedia[]>;
  count(options?: IReviewMediaFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: ReviewMedia[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
