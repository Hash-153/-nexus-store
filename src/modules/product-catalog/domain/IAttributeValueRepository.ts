import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { AttributeValue } from "./AttributeValue.ts";

export interface IAttributeValueFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IAttributeValueRepository extends IRepository<AttributeValue> {
  findByName(name: string): Promise<AttributeValue | null>;
  findByCode?(code: string): Promise<AttributeValue | null>;
  findFiltered(options?: IAttributeValueFilterOptions): Promise<AttributeValue[]>;
  count(options?: IAttributeValueFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: AttributeValue[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
