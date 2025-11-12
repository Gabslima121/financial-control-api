import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateTransactionUseCase } from "../../../application/transaction/create-transaction.usecase";
import { TransactionInput } from "../body-inputs/transaction/transaction.input";
import { CurrentUser } from "../decorators/user.decorator";
import { AuthenticatedUser } from "../types/express";

@ApiTags('Financial Control - Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase
  ) {}

  @Post()
  async createTransaction(
    @Body() createTransactionInput: TransactionInput,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.createTransactionUseCase.execute(createTransactionInput, user.id);
  }
}
