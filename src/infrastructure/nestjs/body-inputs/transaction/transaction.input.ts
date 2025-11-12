import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class TransactionInput {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Category ID' })
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Transaction type' })
  transactionType: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Transaction amount' })
  amount: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Payment method' })
  paymentMethod: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Quantity installments' })
  installments: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Transaction status' })
  transactionStatus: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Transaction date' })
  transactionDate: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Destination ID' })
  destinationId?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'Current installment' })
  currentInstallment?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Transaction description' })
  description?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Due date' })
  dueDate?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Payment date' })
  paymentDate?: string;
}