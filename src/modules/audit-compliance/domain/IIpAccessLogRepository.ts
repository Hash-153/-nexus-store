import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { IpAccessLog } from "./IpAccessLog.ts";

export interface IIpAccessLogFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IIpAccessLogRepository extends IRepository<IpAccessLog> {
  findByName(name: string): Promise<IpAccessLog | null>;
  findByCode?(code: string): Promise<IpAccessLog | null>;
  findFiltered(options?: IIpAccessLogFilterOptions): Promise<IpAccessLog[]>;
  count(options?: IIpAccessLogFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: IpAccessLog[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
