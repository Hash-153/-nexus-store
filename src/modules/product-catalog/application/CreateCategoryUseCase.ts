import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { CreateCategoryDTO, CategoryResponseDTO } from "./dtos/CatalogDTOs.ts";
import type { ICategoryRepository } from "../domain/ICategoryRepository.ts";
import { Category } from "../domain/Category.ts";
import { ConflictError, NotFoundError } from "../../../shared/errors/DomainError.ts";

export class CreateCategoryUseCase implements IUseCase<CreateCategoryDTO, CategoryResponseDTO> {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  public async execute(dto: CreateCategoryDTO): Promise<CategoryResponseDTO> {
    const slug = Category.generateSlug(dto.name);
    const existing = await this.categoryRepository.findBySlug(slug);
    if (existing) {
      throw new ConflictError(`Category with name '${dto.name}' (slug '${slug}') already exists.`);
    }

    if (dto.parentId) {
      const parent = await this.categoryRepository.findById(dto.parentId);
      if (!parent) {
        throw new NotFoundError("Category", dto.parentId);
      }
    }

    const category = Category.create({
      name: dto.name,
      description: dto.description,
      parentId: dto.parentId,
    });

    await this.categoryRepository.save(category);

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      parentId: category.parentId,
      isActive: category.isActive,
    };
  }
}
