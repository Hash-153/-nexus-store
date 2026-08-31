import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { OrderNote } from "./OrderNote.ts";

export interface IOrderNoteFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IOrderNoteRepository extends IRepository<OrderNote> {
  findByName(name: string): Promise<OrderNote | null>;
  findByCode?(code: string): Promise<OrderNote | null>;
  findFiltered(options?: IOrderNoteFilterOptions): Promise<OrderNote[]>;
  count(options?: IOrderNoteFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: OrderNote[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
