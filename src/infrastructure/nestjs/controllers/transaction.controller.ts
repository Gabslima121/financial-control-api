import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateTransactionUseCase } from "../../../application/transaction/create-transaction.usecase";
import { FindUserTransactionsUseCase } from "../../../application/transaction/find-user-transactions.usecase";
import { TransactionInput } from "../body-inputs/transaction/transaction.input";
import { CurrentUser } from "../decorators/user.decorator";
import { AuthenticatedUser } from "../types/express";

@ApiTags('Financial Control - Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly findUserTransactionsUseCase: FindUserTransactionsUseCase
  ) {}

  @Post()
  async createTransaction(
    @Body() createTransactionInput: TransactionInput,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.createTransactionUseCase.execute(createTransactionInput, user.id);
  }

  @Get('user')
  async findUserTransactions(
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.findUserTransactionsUseCase.execute(user.id);
  }
}
