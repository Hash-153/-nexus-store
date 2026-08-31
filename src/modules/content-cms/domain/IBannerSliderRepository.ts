import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { BannerSlider } from "./BannerSlider.ts";

export interface IBannerSliderFilterOptions {
  readonly status?: string;
  readonly isActive?: boolean;
  readonly searchTerm?: string;
  readonly tag?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortDirection?: "asc" | "desc";
}

export interface IBannerSliderRepository extends IRepository<BannerSlider> {
  findByName(name: string): Promise<BannerSlider | null>;
  findByCode?(code: string): Promise<BannerSlider | null>;
  findFiltered(options?: IBannerSliderFilterOptions): Promise<BannerSlider[]>;
  count(options?: IBannerSliderFilterOptions): Promise<number>;
  exists(id: string): Promise<boolean>;
  saveBatch(entities: BannerSlider[]): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
