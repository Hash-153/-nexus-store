import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { DeliverySlot } from "./DeliverySlot.ts";

export interface IDeliverySlotFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IDeliverySlotRepository extends IRepository<DeliverySlot> {
  findByName(name: string): Promise<DeliverySlot | null>;
  findByCode?(code: string): Promise<DeliverySlot | null>;
  findFiltered(options?: IDeliverySlotFilterOptions): Promise<DeliverySlot[]>;
  count(options?: IDeliverySlotFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: DeliverySlot[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
