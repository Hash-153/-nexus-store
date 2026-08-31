import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { GatewayWebhookLog } from "./GatewayWebhookLog.ts";

export interface IGatewayWebhookLogFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IGatewayWebhookLogRepository extends IRepository<GatewayWebhookLog> {
  findByName(name: string): Promise<GatewayWebhookLog | null>;
  findByCode?(code: string): Promise<GatewayWebhookLog | null>;
  findFiltered(options?: IGatewayWebhookLogFilterOptions): Promise<GatewayWebhookLog[]>;
  count(options?: IGatewayWebhookLogFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: GatewayWebhookLog[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
