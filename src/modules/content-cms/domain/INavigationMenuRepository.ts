import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { NavigationMenu } from "./NavigationMenu.ts";

export interface INavigationMenuFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface INavigationMenuRepository extends IRepository<NavigationMenu> {
  findByName(name: string): Promise<NavigationMenu | null>;
  findByCode?(code: string): Promise<NavigationMenu | null>;
  findFiltered(options?: INavigationMenuFilterOptions): Promise<NavigationMenu[]>;
  count(options?: INavigationMenuFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: NavigationMenu[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
