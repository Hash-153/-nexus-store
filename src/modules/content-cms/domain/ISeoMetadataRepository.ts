import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { SeoMetadata } from "./SeoMetadata.ts";

export interface ISeoMetadataFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ISeoMetadataRepository extends IRepository<SeoMetadata> {
  findByName(name: string): Promise<SeoMetadata | null>;
  findByCode?(code: string): Promise<SeoMetadata | null>;
  findFiltered(options?: ISeoMetadataFilterOptions): Promise<SeoMetadata[]>;
  count(options?: ISeoMetadataFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: SeoMetadata[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
