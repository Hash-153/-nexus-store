import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { PointsExpirationPolicy } from "./PointsExpirationPolicy.ts";

export interface IPointsExpirationPolicyFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IPointsExpirationPolicyRepository extends IRepository<PointsExpirationPolicy> {
  findByName(name: string): Promise<PointsExpirationPolicy | null>;
  findByCode?(code: string): Promise<PointsExpirationPolicy | null>;
  findFiltered(options?: IPointsExpirationPolicyFilterOptions): Promise<PointsExpirationPolicy[]>;
  count(options?: IPointsExpirationPolicyFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: PointsExpirationPolicy[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
