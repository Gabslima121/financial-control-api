import { Module } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { CreateCategoryUseCase } from "../../../application/category/create-category.usecase";
import { CategoryPort } from "../../../core/port/category.port";
import { PrismaCategoryRepository } from "../../adapters/category/out/category.repository.adapter";
import { CategoryController } from "../controllers/category.controller";
import { PrismaProvider } from "../providers/prisma.provider";

@Module({
  providers: [
    PrismaProvider,
    {
      provide: 'CategoryPort',
      useFactory: (prisma: PrismaClient) => new PrismaCategoryRepository(prisma),
      inject: [PrismaClient],
    },
    {
      provide: CreateCategoryUseCase,
      useFactory: (categoryPort: CategoryPort) => new CreateCategoryUseCase(categoryPort),
      inject: ['CategoryPort'],
    }
  ],
  controllers: [CategoryController]
})
export class CategoryModule {}