import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ExpenseSplitType } from 'src/core/domain/expense-split-rule/dto';

export class CreateExpenseSplitParticipantDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  personId: string;

  @ApiPropertyOptional({
    description: 'Usado quando o tipo for fixed_percent (0-1)',
  })
  @IsOptional()
  @IsNumber()
  fixedPercent?: number;

  @ApiPropertyOptional({
    description: 'Usado quando o tipo for fixed_amount',
  })
  @IsOptional()
  @IsNumber()
  fixedAmount?: number;
}

export class CreateExpenseSplitRuleDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  accountId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ enum: ExpenseSplitType })
  @IsNotEmpty()
  @IsEnum(ExpenseSplitType)
  type: ExpenseSplitType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  recurrenceGroupId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  transactionId?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ type: [CreateExpenseSplitParticipantDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExpenseSplitParticipantDTO)
  participants: CreateExpenseSplitParticipantDTO[];
}
