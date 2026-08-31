import type { Currency } from "../../../../shared/domain/value-objects/Money.ts";

export interface CreateCategoryDTO {
  name: string;
  description?: string;
  parentId?: string | null;
}

export interface CategoryResponseDTO {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId: string | null;
  isActive: boolean;
}

export interface CreateVariantDTO {
  sku: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  currency?: Currency;
  attributes?: Record<string, string>;
  weightInGrams?: number;
}

export interface CreateProductDTO {
  title: string;
  description: string;
  categoryIds: string[];
  tags?: string[];
  variants: CreateVariantDTO[];
  publishImmediately?: boolean;
}

export interface VariantResponseDTO {
  id: string;
  sku: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  currency: Currency;
  attributes: Record<string, string>;
  weightInGrams?: number;
}

export interface ProductResponseDTO {
  id: string;
  title: string;
  slug: string;
  description: string;
  categoryIds: string[];
  tags: string[];
  variants: VariantResponseDTO[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}
