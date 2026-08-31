import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { ReviewModerationItem } from "./ReviewModerationItem.ts";

export interface IReviewModerationItemFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IReviewModerationItemRepository extends IRepository<ReviewModerationItem> {
  findByName(name: string): Promise<ReviewModerationItem | null>;
  findByCode?(code: string): Promise<ReviewModerationItem | null>;
  findFiltered(options?: IReviewModerationItemFilterOptions): Promise<ReviewModerationItem[]>;
  count(options?: IReviewModerationItemFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: ReviewModerationItem[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
