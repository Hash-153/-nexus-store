import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { CreditNote } from "./CreditNote.ts";

export interface ICreditNoteFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ICreditNoteRepository extends IRepository<CreditNote> {
  findByName(name: string): Promise<CreditNote | null>;
  findByCode?(code: string): Promise<CreditNote | null>;
  findFiltered(options?: ICreditNoteFilterOptions): Promise<CreditNote[]>;
  count(options?: ICreditNoteFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: CreditNote[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
