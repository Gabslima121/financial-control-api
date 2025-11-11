import { Module } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaCategoryRepository } from "../../adapters/category/out/category.repository.adapter";
import { PrismaProvider } from "../providers/prisma.provider";

@Module({
  providers: [
    PrismaProvider,
    {
      provide: 'CategoryPort',
      useFactory: (prisma: PrismaClient) => new PrismaCategoryRepository(prisma),
      inject: [PrismaClient],
    }
  ]
})
export class CategoryModule {}