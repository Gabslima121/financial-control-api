import { CategoriesDomain } from '../domain/categories/categories.domain';
import { CategoryTypeEnum } from '../domain/categories/dto';

export interface CategoryPort {
  createCategory(category: CategoriesDomain, userId: string): Promise<CategoriesDomain>;
  listCategoryByType(type: CategoryTypeEnum): Promise<CategoriesDomain[]>;
  findCategoryById(categoryId: string): Promise<CategoriesDomain | null>;
}
