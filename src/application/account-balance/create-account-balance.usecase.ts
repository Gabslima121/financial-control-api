import { CategoryTypeEnum } from "../../core/domain/categories/dto";
import { AccountBalancePort } from "../../core/port/account-balance.port";
import { TransactionPort } from "../../core/port/transaction.port";
import { AccountBalanceOutput } from "../../infrastructure/adapters/account-balance/out/dto";
import { NotFoundException } from "../../shared/errors/custom.exception";

export class CreateAccountBalanceUseCase {
  constructor(
    private readonly accountBalancePort: AccountBalancePort,
    private readonly transactionPort: TransactionPort,
  ) {}

  async createAccountBalance(userId: string): Promise<AccountBalanceOutput> {
    const transactions = await this.transactionPort.findTransactionsByUser(userId);

    let amout = 0

    for (const transaction of transactions) {
      if (transaction.getTransactionType() === CategoryTypeEnum.EXPENSE) {
        amout -= transaction.getAmount();
      } else {
        amout += transaction.getAmount();
      }
    }

    await this.accountBalancePort.createAccountBalance(
      amout,
      userId,
    )

    const latestAccountBalance = await this.accountBalancePort.findLatestAccountBalance(userId);

    if (!latestAccountBalance) {
      throw new NotFoundException('Account balance not found');
    }

    return {
      balance: latestAccountBalance.getBalance(),
      balanceDate: latestAccountBalance.getBalanceDate(),
    };
  }
}