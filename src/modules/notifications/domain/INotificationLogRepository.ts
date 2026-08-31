import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { NotificationLog } from "./NotificationLog.ts";

export interface INotificationLogFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface INotificationLogRepository extends IRepository<NotificationLog> {
  findByName(name: string): Promise<NotificationLog | null>;
  findByCode?(code: string): Promise<NotificationLog | null>;
  findFiltered(options?: INotificationLogFilterOptions): Promise<NotificationLog[]>;
  count(options?: INotificationLogFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: NotificationLog[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
