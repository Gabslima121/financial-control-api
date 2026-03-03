import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateAccountUseCase } from "src/application/account/create-account.use-case";
import { CreateAccountDTO } from "./dto/create-account.dto";
import { CurrentUser } from "../utils/decorators/user.decorator";
import { AuthenticatedUser } from "../utils/types/express";
import { GetCurrentBalanceUseCase } from "src/application/account/get-current-balance.use-case";

@ApiTags('Financial Control - Account')
@Controller('account')
export class AccountController {
  constructor(
    private readonly createAccountUseCase: CreateAccountUseCase,
    private readonly getCurrentBalanceUseCase: GetCurrentBalanceUseCase
  ) {}

  @Post()
  async createAccount(@Body() createAccountDto: CreateAccountDTO, @CurrentUser() user: AuthenticatedUser) {
    try {
      return await this.createAccountUseCase.execute(createAccountDto, user.id);
    } catch (error) {
      throw error;
    }
  }

  @Get('current-balance')
  async getCurrentBalance(@CurrentUser() user: AuthenticatedUser) {
    try {
      return await this.getCurrentBalanceUseCase.execute(user.id);
    } catch (error) {
      throw error;
    }
  }
}