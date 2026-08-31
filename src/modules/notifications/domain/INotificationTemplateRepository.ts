import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { NotificationTemplate } from "./NotificationTemplate.ts";

export interface INotificationTemplateFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface INotificationTemplateRepository extends IRepository<NotificationTemplate> {
  findByName(name: string): Promise<NotificationTemplate | null>;
  findByCode?(code: string): Promise<NotificationTemplate | null>;
  findFiltered(options?: INotificationTemplateFilterOptions): Promise<NotificationTemplate[]>;
  count(options?: INotificationTemplateFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: NotificationTemplate[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
