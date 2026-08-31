import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { TicketAttachment } from "./TicketAttachment.ts";

export interface ITicketAttachmentFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ITicketAttachmentRepository extends IRepository<TicketAttachment> {
  findByName(name: string): Promise<TicketAttachment | null>;
  findByCode?(code: string): Promise<TicketAttachment | null>;
  findFiltered(options?: ITicketAttachmentFilterOptions): Promise<TicketAttachment[]>;
  count(options?: ITicketAttachmentFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: TicketAttachment[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
