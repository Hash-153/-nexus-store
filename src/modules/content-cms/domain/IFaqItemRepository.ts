import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { FaqItem } from "./FaqItem.ts";

export interface IFaqItemFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IFaqItemRepository extends IRepository<FaqItem> {
  findByName(name: string): Promise<FaqItem | null>;
  findByCode?(code: string): Promise<FaqItem | null>;
  findFiltered(options?: IFaqItemFilterOptions): Promise<FaqItem[]>;
  count(options?: IFaqItemFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: FaqItem[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
