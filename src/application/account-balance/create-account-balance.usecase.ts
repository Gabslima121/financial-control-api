import { CategoryTypeEnum } from "../../core/domain/categories/dto";
import { AccountBalancePort } from "../../core/port/account-balance.port";
import { TransactionPort } from "../../core/port/transaction.port";

export class CreateAccountBalanceUseCase {
  constructor(
    private readonly accountBalancePort: AccountBalancePort,
    private readonly transactionPort: TransactionPort,
  ) {}

  async createAccountBalance(userId: string) {
    const transactions = await this.transactionPort.findTransactionsByUser(userId);

    let amout = 0

    for (const transaction of transactions) {
      if (transaction.getTransactionType() === CategoryTypeEnum.EXPENSE) {
        amout -= transaction.getAmount();
      } else {
        amout += transaction.getAmount();
      }
    }

    const accountBalance = await this.accountBalancePort.createAccountBalance(
      amout,
      userId,
    )

    return accountBalance;
  }
}