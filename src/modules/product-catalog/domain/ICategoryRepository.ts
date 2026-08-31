import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { Category } from "./Category.ts";

export interface ICategoryRepository extends IRepository<Category> {
  findBySlug(slug: string): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
  findByParentId(parentId: string | null): Promise<Category[]>;
}
