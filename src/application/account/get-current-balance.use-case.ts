import { AccountPort } from 'src/core/port/account.port';
import { BankStatementTransactionPort } from 'src/core/port/bank-statement-transaction.port';

export class GetCurrentBalanceUseCase {
  constructor(
    private readonly accountRepository: AccountPort,
    private readonly bankStatementTransactionRepository: BankStatementTransactionPort,
  ) {}

  async execute(accountId: string) {
    const account = await this.accountRepository.findById(accountId);

    if (!account) {
      throw new Error('Account not found');
    }

    const balance =
      await this.bankStatementTransactionRepository.sumAmountByAccountId(
        accountId,
      );

    const total =
      Number(account.getInitialBalance() ?? 0) + Number(balance ?? 0);

    return total;
  }
}
