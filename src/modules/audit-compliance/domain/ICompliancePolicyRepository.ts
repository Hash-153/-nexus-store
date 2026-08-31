import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { CompliancePolicy } from "./CompliancePolicy.ts";

export interface ICompliancePolicyFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ICompliancePolicyRepository extends IRepository<CompliancePolicy> {
  findByName(name: string): Promise<CompliancePolicy | null>;
  findByCode?(code: string): Promise<CompliancePolicy | null>;
  findFiltered(options?: ICompliancePolicyFilterOptions): Promise<CompliancePolicy[]>;
  count(options?: ICompliancePolicyFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: CompliancePolicy[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
