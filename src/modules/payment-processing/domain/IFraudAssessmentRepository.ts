import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { FraudAssessment } from "./FraudAssessment.ts";

export interface IFraudAssessmentFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IFraudAssessmentRepository extends IRepository<FraudAssessment> {
  findByName(name: string): Promise<FraudAssessment | null>;
  findByCode?(code: string): Promise<FraudAssessment | null>;
  findFiltered(options?: IFraudAssessmentFilterOptions): Promise<FraudAssessment[]>;
  count(options?: IFraudAssessmentFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: FraudAssessment[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
