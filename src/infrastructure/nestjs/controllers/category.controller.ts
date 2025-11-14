import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateCategoryUseCase } from "../../../application/category/create-category.usecase";
import { ListCategoryByUserUseCase } from "../../../application/category/list-category-by-user.usecase";
import { CreateCategoryInput } from "../body-inputs/category/category.input";
import { CurrentUser } from "../decorators/user.decorator";
import { AuthenticatedUser } from "../types/express";

@ApiTags('Financial Control - Category')
@Controller('category')
export class CategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly listCategoryByUserUseCase: ListCategoryByUserUseCase,
  ) {}

  @Post()
  async createCategory(@Body() createCategoryInput: CreateCategoryInput, @CurrentUser() user: AuthenticatedUser) {
    return this.createCategoryUseCase.execute(createCategoryInput, user.id);
  }

  @Get()
  async listCategoryByUser(@CurrentUser() user: AuthenticatedUser) {
    return this.listCategoryByUserUseCase.execute(user.id);
  }
}