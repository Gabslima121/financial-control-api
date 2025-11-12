import { CategoryTypeEnumValues } from "../../core/domain/categories/dto";
import { CategoryPort } from "../../core/port/category.port";
import { CategoryDomainAdapter } from "../../infrastructure/adapters/category/in/category.domain.adapter";
import { CategoryOutput } from "../../infrastructure/adapters/category/out/dto";
import { CreateCategoryInput } from "../../infrastructure/nestjs/body-inputs/category/category.input";

export class CreateCategoryUseCase {
  constructor(private readonly categoryPort: CategoryPort) {}

  async execute(createCategoryInput: CreateCategoryInput, userId: string): Promise<CategoryOutput> {
    const categoryType = CategoryTypeEnumValues.find(
      (type) => type === createCategoryInput.categoryType
    );

    if (!categoryType) {
      throw new Error('Invalid category type');
    }

    const domain = CategoryDomainAdapter.toDomain({
      categoryName: createCategoryInput.categoryName,
      categoryType,
      description: createCategoryInput.description,
    })

    const createdCategory = await this.categoryPort.createCategory(domain, userId);

    return {
      categoryName: createdCategory.getCategoryName(),
      categoryType: createdCategory.getCategoryType(),
      description: createdCategory.getDescription()!,
    };
  }
}