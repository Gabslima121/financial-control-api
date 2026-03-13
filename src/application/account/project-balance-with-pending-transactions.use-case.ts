import { FinancialTransactionPort } from 'src/core/port/financial-transaction.port';
import { GetCurrentBalanceUseCase } from './get-current-balance.use-case';

export class ProjectBalanceWithPendingTransactionsUseCase {
  constructor(
    private readonly getCurrentBalanceUseCase: GetCurrentBalanceUseCase,
    private readonly financialTransactionPort: FinancialTransactionPort,
  ) {}

  async execute(accountId: string) {
    const now = new Date();
    const monthEnd = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    await this.financialTransactionPort.syncRecurringTransactions(
      accountId,
      monthEnd,
    );

    const currentBalance =
      await this.getCurrentBalanceUseCase.execute(accountId);

    const pendingTransactions =
      await this.financialTransactionPort.getPendingTransactionsByAccountId(
        accountId,
      );

    const pendingTransactionsInMonth = pendingTransactions.filter(
      (transaction) => {
        const dueDate = transaction.getDueDate();
        if (!dueDate) return false;
        return dueDate <= monthEnd;
      },
    );

    const pendingTransactionsSum = pendingTransactionsInMonth.reduce(
      (acc, transaction) => acc + transaction.getAmount(),
      0,
    );

    const projectedBalance = currentBalance - pendingTransactionsSum;

    return Math.round(projectedBalance * 100) / 100;
  }
}
