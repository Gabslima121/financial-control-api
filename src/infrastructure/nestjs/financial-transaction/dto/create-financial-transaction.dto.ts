import { ApiProperty } from "@nestjs/swagger";
import { PaymentMethod } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { TransactionStatus, TransactionType } from "src/core/domain/financial-transaction/dto";

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
    dueDate: Date | null;

    @ApiProperty({
        description: 'Transaction paid date',
    })
    @IsOptional()
    paidAt: Date | null;
}