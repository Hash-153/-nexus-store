import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { WebhookNotification } from "./WebhookNotification.ts";

export interface IWebhookNotificationFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IWebhookNotificationRepository extends IRepository<WebhookNotification> {
  findByName(name: string): Promise<WebhookNotification | null>;
  findByCode?(code: string): Promise<WebhookNotification | null>;
  findFiltered(options?: IWebhookNotificationFilterOptions): Promise<WebhookNotification[]>;
  count(options?: IWebhookNotificationFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: WebhookNotification[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
