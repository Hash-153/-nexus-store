import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { ProductResponseDTO } from "./dtos/CatalogDTOs.ts";
import type { IProductRepository, ProductFilterOptions } from "../domain/IProductRepository.ts";
import { Product } from "../domain/Product.ts";

export class GetProductCatalogUseCase implements IUseCase<ProductFilterOptions, ProductResponseDTO[]> {
  constructor(private readonly productRepository: IProductRepository) {}

  public async execute(options: ProductFilterOptions = {}): Promise<ProductResponseDTO[]> {
    const products = await this.productRepository.findPublished(options);
    return products.map((p) => this.toDTO(p));
  }

  private toDTO(product: Product): ProductResponseDTO {
    return {
      id: product.id,
      title: product.title,
      slug: product.slug,
      description: product.description,
      categoryIds: [...product.categoryIds],
      tags: [...product.tags],
      variants: product.variants.map((v) => ({
        id: v.id,
        sku: v.sku.value,
        name: v.name,
        price: v.price.amount,
        compareAtPrice: v.compareAtPrice?.amount,
        currency: v.price.currency,
        attributes: v.attributes,
        weightInGrams: v.weightInGrams,
      })),
      isPublished: product.isPublished,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }
}
