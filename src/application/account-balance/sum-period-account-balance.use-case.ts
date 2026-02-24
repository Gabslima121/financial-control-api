import { GetTransactionsByPeriodUseCase } from "../transactions/get-transactions-by-period.use-case";
import { CreateAccountBalanceUseCase } from "./create-account-balance.use-case";

export class SumPeriodAccountBalanceUseCase {
    constructor(
        private readonly getTransactionsByPeriodUseCase: GetTransactionsByPeriodUseCase,
        private readonly createAccountBalanceUseCase: CreateAccountBalanceUseCase,
    ) {}

    async execute(userId: string, startDate: string, endDate: string) {
        const transactions = await this.getTransactionsByPeriodUseCase.execute(userId, startDate, endDate);

        const sumIncome = transactions.filter((transaction) => transaction.getType() === 'income').reduce((acc, transaction) => acc + transaction.getAmount(), 0);
        const sumExpense = transactions.filter((transaction) => transaction.getType() === 'expense').reduce((acc, transaction) => acc + transaction.getAmount(), 0);

        await this.createAccountBalanceUseCase.execute({
            userId,
            balance: sumIncome - sumExpense,
            balanceDate: endDate,
        })
    }
}