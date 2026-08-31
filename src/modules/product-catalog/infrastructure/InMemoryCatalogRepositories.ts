import { InMemoryRepository } from "../../../shared/infrastructure/Repository.ts";
import { Category } from "../domain/Category.ts";
import type { ICategoryRepository } from "../domain/ICategoryRepository.ts";
import { Product } from "../domain/Product.ts";
import type { IProductRepository, ProductFilterOptions } from "../domain/IProductRepository.ts";

export class InMemoryCategoryRepository extends InMemoryRepository<Category> implements ICategoryRepository {
  public async findBySlug(slug: string): Promise<Category | null> {
    for (const cat of this.items.values()) {
      if (cat.slug === slug) {
        return cat;
      }
    }
    return null;
  }

  public async findByName(name: string): Promise<Category | null> {
    const target = name.trim().toLowerCase();
    for (const cat of this.items.values()) {
      if (cat.name.toLowerCase() === target) {
        return cat;
      }
    }
    return null;
  }

  public async findByParentId(parentId: string | null): Promise<Category[]> {
    return Array.from(this.items.values()).filter((c) => c.parentId === parentId);
  }
}

export class InMemoryProductRepository extends InMemoryRepository<Product> implements IProductRepository {
  public async findBySlug(slug: string): Promise<Product | null> {
    for (const prod of this.items.values()) {
      if (prod.slug === slug) {
        return prod;
      }
    }
    return null;
  }

  public async findBySku(sku: string): Promise<Product | null> {
    const formattedSku = sku.trim().toUpperCase();
    for (const prod of this.items.values()) {
      if (prod.variants.some((v) => v.sku.value === formattedSku)) {
        return prod;
      }
    }
    return null;
  }

  public async findPublished(options: ProductFilterOptions = {}): Promise<Product[]> {
    let result = Array.from(this.items.values()).filter((p) => p.isPublished);

    if (options.categoryId) {
      result = result.filter((p) => p.categoryIds.includes(options.categoryId!));
    }

    if (options.tag) {
      result = result.filter((p) => p.tags.includes(options.tag!));
    }

    if (options.searchQuery) {
      const q = options.searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    const offset = options.offset ?? 0;
    const limit = options.limit ?? 50;
    return result.slice(offset, offset + limit);
  }

  public async search(query: string): Promise<Product[]> {
    const q = query.toLowerCase().trim();
    return Array.from(this.items.values()).filter(
      (p) =>
        p.isPublished &&
        (p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)))
    );
  }
}
