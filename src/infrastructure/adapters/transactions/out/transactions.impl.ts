import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { TransactionDomain } from "src/core/domain/transaction/transaction.domain";
import { TransactionsPort } from "src/core/port/transactions.port";

@Injectable()
export class TransactionRepository implements TransactionsPort {
    constructor(private readonly prisma: PrismaClient) {}

    async createTransaction(transaction: TransactionDomain, userId: string): Promise<void> {
        try {
         await this.prisma.transaction.create({
            data: {
                transactionId: transaction.getTransactionId(),
                amount: transaction.getAmount(),
                paymentMethod: transaction.getPaymentMethod(),
                transactionDate: transaction.getTransactionDate(),
                transactionType: transaction.getType(),
                userId,
                installments: transaction?.getInstallments() || 1,
                currentInstallment: transaction?.getCurrentInstallment() || 1,
                description: transaction?.getDescription(),
                transactionStatus: transaction?.getTransactionStatus(),
                dueDate: transaction?.getDueDate(),
                paymentDate: transaction?.getPaymentDate(),
            }
        })   
        } catch (error) {
            console.log(error)
          throw error;  
        }
    }
}
