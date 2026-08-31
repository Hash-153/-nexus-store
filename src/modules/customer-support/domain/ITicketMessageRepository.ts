import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { TicketMessage } from "./TicketMessage.ts";

export interface ITicketMessageFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ITicketMessageRepository extends IRepository<TicketMessage> {
  findByName(name: string): Promise<TicketMessage | null>;
  findByCode?(code: string): Promise<TicketMessage | null>;
  findFiltered(options?: ITicketMessageFilterOptions): Promise<TicketMessage[]>;
  count(options?: ITicketMessageFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: TicketMessage[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
