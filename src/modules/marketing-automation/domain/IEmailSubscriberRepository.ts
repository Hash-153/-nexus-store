import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { EmailSubscriber } from "./EmailSubscriber.ts";

export interface IEmailSubscriberFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IEmailSubscriberRepository extends IRepository<EmailSubscriber> {
  findByName(name: string): Promise<EmailSubscriber | null>;
  findByCode?(code: string): Promise<EmailSubscriber | null>;
  findFiltered(options?: IEmailSubscriberFilterOptions): Promise<EmailSubscriber[]>;
  count(options?: IEmailSubscriberFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: EmailSubscriber[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
