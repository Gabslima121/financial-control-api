import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { TransactionDomain } from "src/core/domain/transaction/transaction.domain";
import { TransactionParams, TransactionsPort } from "src/core/port/transactions.port";
import { parse } from "date-fns";

@Injectable()
export class TransactionRepository implements TransactionsPort {
    constructor(private readonly prisma: PrismaClient) {}

    async getTransactionsWithParams(userId: string, params: TransactionParams): Promise<TransactionDomain[]> {
        try {
            const { transactionStatus, transactionDate, dueDate } = params;

            const where: any = {
                userId,
            };

            if (transactionStatus !== undefined) {
                where.transactionStatus = transactionStatus;
            }

            if (transactionDate !== undefined) {
                where.transactionDate =
                    typeof transactionDate === "string"
                        ? parse(transactionDate, "yyyy-MM-dd", new Date())
                        : transactionDate;
            }

            if (dueDate !== undefined) {
                where.dueDate =
                    typeof dueDate === "string"
                        ? parse(dueDate, "yyyy-MM-dd", new Date())
                        : dueDate;
            }

            const transactions = await this.prisma.transaction.findMany({
                where,
            })
            
            return transactions.map((transaction) => TransactionDomain.create({
                transactionId: transaction.transactionId,
                user: null,
                type: transaction.transactionType,
                amount: transaction.amount.toNumber(),
                paymentMethod: transaction.paymentMethod,
                installments: transaction.installments,
                currentInstallment: transaction.currentInstallment,
                description: transaction.description,
                transactionStatus: transaction.transactionStatus,
                transactionDate: transaction.transactionDate,
                dueDate: transaction.dueDate,
                paymentDate: transaction.paymentDate,
                createdAt: transaction.createdAt,
                updatedAt: transaction.updatedAt,
            }));
        } catch (error) {
            throw error;  
        }
    }

    async getTransactionsByPeriod(userId: string, startDate: string, endDate: string): Promise<TransactionDomain[]> {
        try {
            const transactions = await this.prisma.transaction.findMany({
                where: {
                    userId,
                    transactionDate: {
                        gte: parse(startDate, "yyyy-MM-dd", new Date()),
                        lte: parse(endDate, "yyyy-MM-dd", new Date()),
                    }
                }
            })
            
            return transactions.map((transaction) => TransactionDomain.create({
                transactionId: transaction.transactionId,
                user: null,
                type: transaction.transactionType,
                amount: transaction.amount.toNumber(),
                paymentMethod: transaction.paymentMethod,
                installments: transaction.installments,
                currentInstallment: transaction.currentInstallment,
                description: transaction.description,
                transactionStatus: transaction.transactionStatus,
                transactionDate: transaction.transactionDate,
                dueDate: transaction.dueDate,
                paymentDate: transaction.paymentDate,
                createdAt: transaction.createdAt,
                updatedAt: transaction.updatedAt,
            }));
        } catch (error) {
            throw error;  
        }
    }

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
