import { TransactionPort } from "../../core/port/transaction.port";
import { TransactionOutput } from "../../infrastructure/adapters/transaction/out/dto";

export class FindUserTransactionsUseCase {
  constructor(private transactionRepository: TransactionPort) {}

  async execute(userId: string): Promise<TransactionOutput[]> {
    const transactions = await this.transactionRepository.findTransactionsByUser(userId);

    if (!transactions.length) {
      return [];
    }

    return transactions.map(transaction => ({
      amount: transaction.getAmount(),
      categoryName: transaction.getCategory()?.getCategoryName() || '',
      paymentMethod: transaction.getPaymentMethod(),
      transactionDate: transaction.getTransactionDate(),
      transactionType: transaction.getTransactionType(),
      userName: transaction.getUser()?.getUserName() || '',
      destinationName: transaction.getDestination()?.getCompanyName() || '',
      currentInstallment: transaction.getCurrentInstallment(),
      installments: transaction.getInstallments(),
      description: transaction.getDescription()!,
      dueDate: transaction.getDueDate()!,
      paymentDate: transaction.getPaymentDate()!,
      parentTransactionId: transaction.getParentTransactionId()!,
      transactionId: transaction.getTransactionId().getValue()!,
      transactionStatus: transaction.getTransactionStatus()!,
    }))
  }
}