import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateAccountUseCase } from 'src/application/account/create-account.use-case';
import { GetCurrentBalanceUseCase } from 'src/application/account/get-current-balance.use-case';
import { ProjectBalanceWithPendingTransactionsUseCase } from 'src/application/account/project-balance-with-pending-transactions.use-case';
import { GetUserAccountsUseCase } from '../../../application/account/get-user-accounts.use-case';
import { CurrentUser } from '../utils/decorators/user.decorator';
import { AuthenticatedUser } from '../utils/types/express';
import { CreateAccountDTO } from './dto/create-account.dto';

@ApiTags('Financial Control - Account')
@Controller('account')
export class AccountController {
  constructor(
    private readonly createAccountUseCase: CreateAccountUseCase,
    private readonly getCurrentBalanceUseCase: GetCurrentBalanceUseCase,
    private readonly projectBalanceWithPendingTransactionsUseCase: ProjectBalanceWithPendingTransactionsUseCase,
    private readonly getUserAccountsUseCase: GetUserAccountsUseCase,
  ) {}

  @Post()
  async createAccount(
    @Body() createAccountDto: CreateAccountDTO,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.createAccountUseCase.execute(createAccountDto, user.id);
  }

  @Get('current-balance')
  async getCurrentBalance(@CurrentUser() user: AuthenticatedUser) {
    return await this.getCurrentBalanceUseCase.execute(user.accountId);
  }

  @Get('project-balance-with-pending-transactions')
  async projectBalanceWithPendingTransactions(
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.projectBalanceWithPendingTransactionsUseCase.execute(
      user.accountId,
    );
  }

  @Get('list-accounts')
  async listAccounts(@CurrentUser() user: AuthenticatedUser) {
    return await this.getUserAccountsUseCase.execute(user.id);
  }
}
