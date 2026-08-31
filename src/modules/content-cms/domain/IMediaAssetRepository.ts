import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { MediaAsset } from "./MediaAsset.ts";

export interface IMediaAssetFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IMediaAssetRepository extends IRepository<MediaAsset> {
  findByName(name: string): Promise<MediaAsset | null>;
  findByCode?(code: string): Promise<MediaAsset | null>;
  findFiltered(options?: IMediaAssetFilterOptions): Promise<MediaAsset[]>;
  count(options?: IMediaAssetFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: MediaAsset[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
