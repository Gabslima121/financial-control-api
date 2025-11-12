import { PrismaClient } from "@prisma/client";
import { CategoryTypeEnumValues } from "../../../../core/domain/categories/dto";
import { PaymentMethodValues, TransactionStatusValues } from "../../../../core/domain/transactions/dto";
import { TransactionsDomain } from "../../../../core/domain/transactions/transactions.domain";
import { TransactionPort } from "../../../../core/port/transaction.port";
import { TransactionDomainAdapter } from "../in/transaction.domain.adapter";

export class PrismaTransactionRepository implements TransactionPort {
  constructor(
    private readonly prisma: PrismaClient
  ) {}

  async createTransaction(transaction: TransactionsDomain, userId: string): Promise<TransactionsDomain> {
    const createdTransaction = await this.prisma.transaction.create({
      data: {
        amount: transaction.getAmount(),
        paymentMethod: transaction.getPaymentMethod(),
        transactionDate: transaction.getTransactionDate(),
        transactionType: transaction.getTransactionType(),
        transactionStatus: transaction.getTransactionStatus(),
        userId,
        categoryId: transaction.getCategory()?.getCategoryId().getValue(),
      },
    });

    const paymentMethod = PaymentMethodValues.find((value) => value === createdTransaction.paymentMethod);
    const transactionStatus = TransactionStatusValues.find((value) => value === createdTransaction.transactionStatus);
    const transactionType = CategoryTypeEnumValues.find((value) => value === createdTransaction.transactionType);

    if (!paymentMethod || !transactionStatus || !transactionType) {
      throw new Error('Payment method or transaction status not found');
    }

    return TransactionDomainAdapter.toDomain({
      amount: createdTransaction.amount.toNumber(),
      paymentMethod,
      transactionDate: createdTransaction.transactionDate,
      transactionStatus,
      transactionType,
      category: transaction.getCategory(),
    });
  }
}
