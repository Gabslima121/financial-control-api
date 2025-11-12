import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryInput {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Category name' })
  categoryName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Category type' })
  categoryType: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Category description' })
  description?: string;
}