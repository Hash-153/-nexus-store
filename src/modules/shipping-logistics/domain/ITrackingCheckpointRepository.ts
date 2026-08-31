import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { TrackingCheckpoint } from "./TrackingCheckpoint.ts";

export interface ITrackingCheckpointFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ITrackingCheckpointRepository extends IRepository<TrackingCheckpoint> {
  findByName(name: string): Promise<TrackingCheckpoint | null>;
  findByCode?(code: string): Promise<TrackingCheckpoint | null>;
  findFiltered(options?: ITrackingCheckpointFilterOptions): Promise<TrackingCheckpoint[]>;
  count(options?: ITrackingCheckpointFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: TrackingCheckpoint[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
