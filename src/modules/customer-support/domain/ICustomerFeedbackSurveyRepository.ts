import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { CustomerFeedbackSurvey } from "./CustomerFeedbackSurvey.ts";

export interface ICustomerFeedbackSurveyFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface ICustomerFeedbackSurveyRepository extends IRepository<CustomerFeedbackSurvey> {
  findByName(name: string): Promise<CustomerFeedbackSurvey | null>;
  findByCode?(code: string): Promise<CustomerFeedbackSurvey | null>;
  findFiltered(options?: ICustomerFeedbackSurveyFilterOptions): Promise<CustomerFeedbackSurvey[]>;
  count(options?: ICustomerFeedbackSurveyFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: CustomerFeedbackSurvey[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
