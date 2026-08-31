import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { Session } from "./Session.ts";

export interface ISessionFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ISessionRepository extends IRepository<Session> {
  findByName(name: string): Promise<Session | null>;
  findByCode?(code: string): Promise<Session | null>;
  findFiltered(options?: ISessionFilterOptions): Promise<Session[]>;
  count(options?: ISessionFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: Session[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
