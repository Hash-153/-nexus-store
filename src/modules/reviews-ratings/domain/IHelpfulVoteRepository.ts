import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { HelpfulVote } from "./HelpfulVote.ts";

export interface IHelpfulVoteFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IHelpfulVoteRepository extends IRepository<HelpfulVote> {
  findByName(name: string): Promise<HelpfulVote | null>;
  findByCode?(code: string): Promise<HelpfulVote | null>;
  findFiltered(options?: IHelpfulVoteFilterOptions): Promise<HelpfulVote[]>;
  count(options?: IHelpfulVoteFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: HelpfulVote[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
