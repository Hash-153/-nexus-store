import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { BlogPost } from "./BlogPost.ts";

export interface IBlogPostFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IBlogPostRepository extends IRepository<BlogPost> {
  findByName(name: string): Promise<BlogPost | null>;
  findByCode?(code: string): Promise<BlogPost | null>;
  findFiltered(options?: IBlogPostFilterOptions): Promise<BlogPost[]>;
  count(options?: IBlogPostFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: BlogPost[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
