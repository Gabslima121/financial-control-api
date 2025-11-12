import { TransactionDomainDTO } from "../../../../core/domain/transactions/dto";
import { TransactionsDomain } from "../../../../core/domain/transactions/transactions.domain";

export class TransactionDomainAdapter {
  public static toDomain(transaction: TransactionDomainDTO): TransactionsDomain {
    return TransactionsDomain.create(transaction);
  }

  public static toDTO(transaction: TransactionsDomain): TransactionDomainDTO {
    return {
      amount: transaction.getAmount(),
      transactionType: transaction.getTransactionType(),
      transactionDate: transaction.getTransactionDate(),
      description: transaction.getDescription(),
      paymentMethod: transaction.getPaymentMethod(),
      category: transaction.getCategory(),
      createdAt: transaction.getCreatedAt(),
      updatedAt: transaction.getUpdatedAt(),
      currentInstallment: transaction.getCurrentInstallment(),
      destination: transaction.getDestination(),
      dueDate: transaction.getDueDate(),
      installments: transaction.getInstallments(),
      parentTransactionId: transaction.getParentTransactionId(),
      paymentDate: transaction.getPaymentDate(),
      transactionId: transaction.getTransactionId().getValue(),
      transactionStatus: transaction.getTransactionStatus(),
      user: transaction.getUser(),
    }
  }
}