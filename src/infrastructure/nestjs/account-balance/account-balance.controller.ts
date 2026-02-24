import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SumPeriodAccountBalanceUseCase } from "src/application/account-balance/sum-period-account-balance.use-case";
import { CurrentUser } from "../utils/decorators/user.decorator";
import { AuthenticatedUser } from "../utils/types/express";
import { ProjectBalancePendingTransactionsUseCase } from "src/application/account-balance/project-balance-pending-transactions.use-case";

@ApiTags('Financial Control - Account Balance')
@Controller('account-balance')
export class AccountBalanceController {
    constructor(
        private readonly sumPeriodAccountBalanceUseCase: SumPeriodAccountBalanceUseCase,
        private readonly projectBalancePendingTransactionsUseCase: ProjectBalancePendingTransactionsUseCase,
    ) {}

    @Get('sum-period')
    async sumPeriodAccountBalance(
        @CurrentUser() user: AuthenticatedUser,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ) {
        return await this.sumPeriodAccountBalanceUseCase.execute(user.id, startDate, endDate);
    }

    @Get('project-pending-transactions')
    async projectBalancePendingTransactions(
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return await this.projectBalancePendingTransactionsUseCase.execute(user.id);
    }
}