import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import {
  RecurrenceFrequency,
  TransactionStatus,
  TransactionType,
} from 'src/core/domain/financial-transaction/dto';

export class CreateFinancialTransactionDTO {
  @ApiProperty({
    description: 'Transaction type',
    enum: TransactionType,
  })
  @IsNotEmpty()
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({
    description: 'Transaction status',
    enum: TransactionStatus,
  })
  @IsNotEmpty()
  @IsEnum(TransactionStatus)
  status: TransactionStatus;

  @ApiProperty({
    description: 'Transaction amount',
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Transaction description',
  })
  @IsString()
  @IsOptional()
  description: string | null;

  @ApiProperty({
    description: 'Transaction payment method',
    enum: PaymentMethod,
  })
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod | null;

  @ApiProperty({
    description: 'Transaction due date',
  })
  @IsOptional()
  @Type(() => Date)
  dueDate: Date | null;

  @ApiProperty({
    description: 'Transaction paid date',
  })
  @IsOptional()
  @Type(() => Date)
  paidAt: Date | null;

  @ApiPropertyOptional({
    description:
      'Se true, cria uma série recorrente e gera lançamentos pendentes',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @ApiPropertyOptional({
    description: 'Frequência da recorrência',
    enum: RecurrenceFrequency,
    default: RecurrenceFrequency.MONTHLY,
  })
  @ValidateIf((dto: CreateFinancialTransactionDTO) => dto.isRecurring === true)
  @IsEnum(RecurrenceFrequency)
  recurrenceFrequency?: RecurrenceFrequency;

  @ApiPropertyOptional({
    description: 'Intervalo da recorrência (ex.: 1 = todo mês)',
    default: 1,
  })
  @ValidateIf((dto: CreateFinancialTransactionDTO) => dto.isRecurring === true)
  @IsInt()
  @Min(1)
  recurrenceInterval?: number;

  @ApiPropertyOptional({
    description: 'Dia do mês (1-31). Se não informado, usa o dia do dueDate',
    minimum: 1,
    maximum: 31,
  })
  @ValidateIf((dto: CreateFinancialTransactionDTO) => dto.isRecurring === true)
  @IsInt()
  @Min(1)
  @Max(31)
  recurrenceDayOfMonth?: number;

  @ApiPropertyOptional({
    description: 'Quantidade de meses a gerar a partir do dueDate',
    default: 12,
  })
  @ValidateIf((dto: CreateFinancialTransactionDTO) => dto.isRecurring === true)
  @IsInt()
  @Min(1)
  recurrenceGenerateMonths?: number;
}
