import { PrismaClient } from "@prisma/client";
import { CategoriesDomain } from "../../../../core/domain/categories/categories.domain";
import { CategoryTypeEnum, CategoryTypeEnumValues } from "../../../../core/domain/categories/dto";
import { CategoryPort } from "../../../../core/port/category.port";
import { CategoryDomainAdapter } from "../in/category.domain.adapter";

export class PrismaCategoryRepository implements CategoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  async findCategoryById(categoryId: string): Promise<CategoriesDomain | null> {
    const category = await this.prisma.category.findFirst({
      where: {
        categoryId
      }
    });

    if (!category) {
      return null;
    }

    const categoryType = CategoryTypeEnumValues.find((item) => item === category.categoryType);

    if (!categoryType) {
      return null;
    }

    return CategoryDomainAdapter.toDomain({
      categoryId: category.categoryId,
      categoryName: category.categoryName,
      categoryType,
      createdAt: category.createdAt,
      description: category.description,
    })
  }

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
