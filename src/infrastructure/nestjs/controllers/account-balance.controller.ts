import { Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateAccountBalanceUseCase } from "../../../application/account-balance/create-account-balance.usecase";
import { CurrentUser } from "../decorators/user.decorator";
import { AuthenticatedUser } from "../types/express";

@ApiTags('Financial Control - Account Balance')
@Controller('account-balance')
export class AccountBalanceController {
  constructor(
    private readonly createAccountBalanceUseCase: CreateAccountBalanceUseCase,
  ) {}

  @Post()
  async createAccountBalance(@CurrentUser() user: AuthenticatedUser) {
    return this.createAccountBalanceUseCase.createAccountBalance(user.id);
  }
}