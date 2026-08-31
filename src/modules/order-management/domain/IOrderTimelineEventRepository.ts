import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { OrderTimelineEvent } from "./OrderTimelineEvent.ts";

export interface IOrderTimelineEventFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IOrderTimelineEventRepository extends IRepository<OrderTimelineEvent> {
  findByName(name: string): Promise<OrderTimelineEvent | null>;
  findByCode?(code: string): Promise<OrderTimelineEvent | null>;
  findFiltered(options?: IOrderTimelineEventFilterOptions): Promise<OrderTimelineEvent[]>;
  count(options?: IOrderTimelineEventFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: OrderTimelineEvent[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
