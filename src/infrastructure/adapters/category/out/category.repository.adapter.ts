import { PrismaClient } from "@prisma/client";
import { CategoriesDomain } from "../../../../core/domain/categories/categories.domain";
import { CategoryTypeEnum } from "../../../../core/domain/categories/dto";
import { CategoryPort } from "../../../../core/port/category.port";

export class PrismaCategoryRepository implements CategoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  async createCategory(category: CategoriesDomain): Promise<CategoriesDomain> {
    throw new Error("Method not implemented.");
  }

  async listCategoryByType(type: CategoryTypeEnum): Promise<CategoriesDomain[]> {
    throw new Error("Method not implemented.");
  }
}
