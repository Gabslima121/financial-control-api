import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  Max,
  Min
} from 'class-validator';
import {
  TransactionStatus,
  TransactionType,
} from 'src/core/domain/financial-transaction/dto';

export class ListFinancialTransactionsQueryDTO {
  @ApiPropertyOptional({ enum: TransactionType })
  @IsOptional()
  type?: TransactionType;

  @ApiPropertyOptional({ enum: TransactionStatus })
  @IsOptional()
  status?: TransactionStatus;

  @ApiPropertyOptional({ description: 'Data início (ISO 8601)' })
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Data fim (ISO 8601)' })
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 20;
}
