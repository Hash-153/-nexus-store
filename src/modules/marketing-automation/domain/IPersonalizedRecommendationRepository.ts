import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { PersonalizedRecommendation } from "./PersonalizedRecommendation.ts";

export interface IPersonalizedRecommendationFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IPersonalizedRecommendationRepository extends IRepository<PersonalizedRecommendation> {
  findByName(name: string): Promise<PersonalizedRecommendation | null>;
  findByCode?(code: string): Promise<PersonalizedRecommendation | null>;
  findFiltered(options?: IPersonalizedRecommendationFilterOptions): Promise<PersonalizedRecommendation[]>;
  count(options?: IPersonalizedRecommendationFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: PersonalizedRecommendation[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
