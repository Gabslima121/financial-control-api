import { AccountBalancePort } from "src/core/port/account-balance.port";

export class CreateAccountBalanceUseCase {
    constructor(
        private readonly accountBalanceRepository: AccountBalancePort,
    ) {}

    async execute(params: any): Promise<void> {
        await this.accountBalanceRepository.createAccountBalance(params);
    }
}