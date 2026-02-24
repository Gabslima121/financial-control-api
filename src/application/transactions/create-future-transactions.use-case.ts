import { TransactionStatus } from "@prisma/client";
import { TransactionsPort } from "src/core/port/transactions.port";
import { TransactionAdapter } from "src/infrastructure/adapters/transactions/in/transactions.adapter";
import { CreateTransactionsDTO } from "src/infrastructure/nestjs/transactions/dto/create-transactions.dto";
import { parse } from 'date-fns';

export class CreateFutureTransactionUseCase {

    constructor(
        private readonly futureTransactionsPort: TransactionsPort
    ) {}

    async execute(createTransactionsDTO: CreateTransactionsDTO, userId: string) {
        const transactionDomain = TransactionAdapter.toDomain({
            amount: createTransactionsDTO.amount,
            paymentMethod: createTransactionsDTO.paymentMethod,
            installments: createTransactionsDTO.installments!,
            currentInstallment: createTransactionsDTO.currentInstallment!,
            description: createTransactionsDTO.description!,
            transactionDate: parse(createTransactionsDTO.transactionDate, 'yyyy-MM-dd', new Date()),
            transactionStatus: TransactionStatus.pending,
            paymentDate: parse(createTransactionsDTO.paymentDate, 'yyyy-MM-dd', new Date()),
            dueDate: parse(createTransactionsDTO.paymentDate, 'yyyy-MM-dd', new Date()),
            type: createTransactionsDTO.transactionType,
        });

        await this.futureTransactionsPort.createTransaction(transactionDomain, userId);
    }
}