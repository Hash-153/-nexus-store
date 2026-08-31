import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { SmsMessage } from "./SmsMessage.ts";

export interface ISmsMessageFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ISmsMessageRepository extends IRepository<SmsMessage> {
  findByName(name: string): Promise<SmsMessage | null>;
  findByCode?(code: string): Promise<SmsMessage | null>;
  findFiltered(options?: ISmsMessageFilterOptions): Promise<SmsMessage[]>;
  count(options?: ISmsMessageFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: SmsMessage[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
