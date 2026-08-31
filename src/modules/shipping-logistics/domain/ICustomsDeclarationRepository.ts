import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { CustomsDeclaration } from "./CustomsDeclaration.ts";

export interface ICustomsDeclarationFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ICustomsDeclarationRepository extends IRepository<CustomsDeclaration> {
  findByName(name: string): Promise<CustomsDeclaration | null>;
  findByCode?(code: string): Promise<CustomsDeclaration | null>;
  findFiltered(options?: ICustomsDeclarationFilterOptions): Promise<CustomsDeclaration[]>;
  count(options?: ICustomsDeclarationFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: CustomsDeclaration[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
