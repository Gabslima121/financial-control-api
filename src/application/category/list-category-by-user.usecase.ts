import { CategoryPort } from "../../core/port/category.port";
import { CategoryOutput } from "../../infrastructure/adapters/category/out/dto";

export class ListCategoryByUserUseCase {
  constructor(private readonly categoryPort: CategoryPort) {}

  async execute(userId: string): Promise<CategoryOutput[]> {
    const categories = await this.categoryPort.findCategoryByUserId(userId);

    if (!categories) {
      return [];
    }

    return categories.map((category) => ({
      categoryId: category.getCategoryId().getValue(),
      categoryName: category.getCategoryName(),
      categoryType: category.getCategoryType(),
    }));
  }
}