import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { CreateProductDTO, ProductResponseDTO } from "./dtos/CatalogDTOs.ts";
import type { IProductRepository } from "../domain/IProductRepository.ts";
import type { ICategoryRepository } from "../domain/ICategoryRepository.ts";
import { Product } from "../domain/Product.ts";
import { ProductVariant } from "../domain/ProductVariant.ts";
import { SKU } from "../../../shared/domain/value-objects/SKU.ts";
import { Money } from "../../../shared/domain/value-objects/Money.ts";
import { ConflictError, NotFoundError, ValidationError } from "../../../shared/errors/DomainError.ts";

export class CreateProductUseCase implements IUseCase<CreateProductDTO, ProductResponseDTO> {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly categoryRepository: ICategoryRepository
  ) {}

  public async execute(dto: CreateProductDTO): Promise<ProductResponseDTO> {
    const slug = Product.generateSlug(dto.title);
    const existing = await this.productRepository.findBySlug(slug);
    if (existing) {
      throw new ConflictError(`Product with title '${dto.title}' (slug '${slug}') already exists.`);
    }

    for (const catId of dto.categoryIds) {
      const category = await this.categoryRepository.findById(catId);
      if (!category) {
        throw new NotFoundError("Category", catId);
      }
    }

    if (!dto.variants || dto.variants.length === 0) {
      throw new ValidationError("A product must contain at least one variant.");
    }

    const variants: ProductVariant[] = [];
    for (const varDto of dto.variants) {
      const sku = SKU.create(varDto.sku);
      const existingSkuProduct = await this.productRepository.findBySku(sku.value);
      if (existingSkuProduct) {
        throw new ConflictError(`SKU '${sku.value}' is already assigned to another product.`);
      }

      const price = Money.create(varDto.price, varDto.currency ?? "USD");
      const compareAtPrice = varDto.compareAtPrice
        ? Money.create(varDto.compareAtPrice, varDto.currency ?? "USD")
        : undefined;

      const variant = ProductVariant.create({
        sku,
        name: varDto.name,
        price,
        compareAtPrice,
        attributes: varDto.attributes,
        weightInGrams: varDto.weightInGrams,
      });

      variants.push(variant);
    }

    const product = Product.create({
      title: dto.title,
      description: dto.description,
      categoryIds: dto.categoryIds,
      tags: dto.tags,
      variants,
    });

    if (dto.publishImmediately) {
      product.publish();
    }

    await this.productRepository.save(product);

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
