import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { EmailMessage } from "./EmailMessage.ts";

export interface IEmailMessageFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IEmailMessageRepository extends IRepository<EmailMessage> {
  findByName(name: string): Promise<EmailMessage | null>;
  findByCode?(code: string): Promise<EmailMessage | null>;
  findFiltered(options?: IEmailMessageFilterOptions): Promise<EmailMessage[]>;
  count(options?: IEmailMessageFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: EmailMessage[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
