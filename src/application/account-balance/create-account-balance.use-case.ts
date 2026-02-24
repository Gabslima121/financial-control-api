import { AccountBalancePort } from "src/core/port/account-balance.port";
import { CreateAccountBalanceDto } from "./dto";
import { AccountBalanceDomain } from "src/core/domain/account-balance/account-balance.domain";
import { AccountBalanceAdapter } from "src/infrastructure/adapters/account-balance/in/account-balance.adapter";
import { UserPort } from "src/core/port/user.port";

export class CreateAccountBalanceUseCase {
    constructor(
        private readonly accountBalanceRepository: AccountBalancePort,
        private readonly userRepository: UserPort,
    ) {}

    async execute(params: CreateAccountBalanceDto): Promise<void> {
        const user = await this.userRepository.findById(params.userId);

        const accountBalanceDomain = AccountBalanceAdapter.toDomain({
            balance: params.balance,
            balanceDate: new Date(params.balanceDate),
            notes: null,
            user: user,
            balanceId: null,
        });

        await this.accountBalanceRepository.createAccountBalance(accountBalanceDomain);
    }
}