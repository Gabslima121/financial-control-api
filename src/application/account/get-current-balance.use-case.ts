import { AccountPort } from "src/core/port/account.port";
import { BankStatementTransactionPort } from "src/core/port/bank-statement-transaction.port";
import { UserPort } from "src/core/port/user.port";
import { AccountRepository } from "src/infrastructure/adapters/account/out/account.impl";

export class GetCurrentBalanceUseCase {
    constructor(
        private readonly accountRepository: AccountPort,
        private readonly bankStatementTransactionRepository: BankStatementTransactionPort,
    ) {}

    async execute(userId: string) {
        const account = await this.accountRepository.listAccountsByUserId(userId);

        if (!account) {
            throw new Error('Account not found');
        }

        const balance = await this.bankStatementTransactionRepository.sumAmountByAccountId(account[0].getId());

        const total =
          Number(account[0].getInitialBalance() ?? 0) +
          Number(balance ?? 0);


        return total;
    }
}