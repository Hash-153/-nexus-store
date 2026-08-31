import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { PushNotification } from "./PushNotification.ts";

export interface IPushNotificationFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IPushNotificationRepository extends IRepository<PushNotification> {
  findByName(name: string): Promise<PushNotification | null>;
  findByCode?(code: string): Promise<PushNotification | null>;
  findFiltered(options?: IPushNotificationFilterOptions): Promise<PushNotification[]>;
  count(options?: IPushNotificationFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: PushNotification[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
