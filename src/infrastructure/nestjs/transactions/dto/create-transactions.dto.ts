import { ApiProperty } from "@nestjs/swagger";
import { PaymentMethod, TransactionType } from "@prisma/client";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTransactionsDTO {
    @ApiProperty({
        description: 'Transaction type',
        enum: TransactionType,
    })
    @IsEnum(TransactionType, { message: 'Transaction type must be a valid value' })
    transactionType: TransactionType;

    @ApiProperty({
        description: 'Transaction amount',
        type: Number,
        example: 1000,
    })
    @IsNumber({}, { message: 'Amount must be a number' })
    amount: number;

    @ApiProperty({
        description: 'Payment method',
        enum: PaymentMethod,
    })
    @IsEnum(PaymentMethod, { message: 'Payment method must be a valid value' })
    paymentMethod: PaymentMethod;

    @ApiProperty({
        description: 'Installments',
        type: Number,
        example: 10,
    })
    @IsOptional()
    @IsNumber({}, { message: 'Installments must be a number' })
    installments?: number;

    @ApiProperty({
        description: 'Current installment',
        type: Number,
        example: 1,
    })
    @IsOptional()
    @IsNumber({}, { message: 'Current installment must be a number' })
    currentInstallment?: number;

    @ApiProperty({
        description: 'Transaction description',
        type: String,
        example: 'Payment for services',
    })
    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    description?: string;

    @ApiProperty({
        description: 'Transaction date',
        type: Date,
        example: '2023-01-01',
    })
    @IsString({ message: 'Transaction date must be a string' })
    transactionDate: string
    
    @ApiProperty({
        description: 'Payment date',
        type: Date,
        example: '2023-01-01',
    })
    @IsString({ message: 'Payment date must be a string' })
    paymentDate: string
}