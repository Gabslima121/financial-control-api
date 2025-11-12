import { PrismaClient } from "@prisma/client";
import { CategoriesDomain } from "../../../../core/domain/categories/categories.domain";
import { CategoryTypeEnum } from "../../../../core/domain/categories/dto";
import { CategoryPort } from "../../../../core/port/category.port";
import { CategoryDomainAdapter } from "../in/category.domain.adapter";

export class PrismaCategoryRepository implements CategoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  async createCategory(category: CategoriesDomain, userId: string): Promise<CategoriesDomain> {
    const entity = await this.prisma.category.create({
      data: {
        userId,
        categoryId: category.getCategoryId().getValue(),
        categoryName: category.getCategoryName(),
        categoryType: category.getCategoryType(),
        createdAt: category.getCreatedAt(),
        description: category.getDescription(),
      }
    })

    const categoryType = entity.categoryType as CategoryTypeEnum;

    return CategoryDomainAdapter.toDomain({
      categoryId: entity.categoryId,
      categoryName: entity.categoryName,
      categoryType,
      createdAt: entity.createdAt,
      description: entity.description,
    })
  }

  async listCategoryByType(type: CategoryTypeEnum): Promise<CategoriesDomain[]> {
    throw new Error("Method not implemented.");
  }
}
