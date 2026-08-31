import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { SupportTicket } from "./SupportTicket.ts";

export interface ISupportTicketFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ISupportTicketRepository extends IRepository<SupportTicket> {
  findByName(name: string): Promise<SupportTicket | null>;
  findByCode?(code: string): Promise<SupportTicket | null>;
  findFiltered(options?: ISupportTicketFilterOptions): Promise<SupportTicket[]>;
  count(options?: ISupportTicketFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: SupportTicket[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
