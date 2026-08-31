import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { BoxPackage } from "./BoxPackage.ts";

export interface IBoxPackageFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IBoxPackageRepository extends IRepository<BoxPackage> {
  findByName(name: string): Promise<BoxPackage | null>;
  findByCode?(code: string): Promise<BoxPackage | null>;
  findFiltered(options?: IBoxPackageFilterOptions): Promise<BoxPackage[]>;
  count(options?: IBoxPackageFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: BoxPackage[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
