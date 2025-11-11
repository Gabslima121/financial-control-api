import { CategoriesDomain } from "../domain/categories/categories.domain";
import { CategoryTypeEnum } from "../domain/categories/dto";

export interface CategoryPort {
  createCategory(category: CategoriesDomain): Promise<CategoriesDomain>;
  listCategoryByType(type: CategoryTypeEnum): Promise<CategoriesDomain[]>;
}