import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { CmsPage } from "./CmsPage.ts";

export interface ICmsPageFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ICmsPageRepository extends IRepository<CmsPage> {
  findByName(name: string): Promise<CmsPage | null>;
  findByCode?(code: string): Promise<CmsPage | null>;
  findFiltered(options?: ICmsPageFilterOptions): Promise<CmsPage[]>;
  count(options?: ICmsPageFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: CmsPage[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
