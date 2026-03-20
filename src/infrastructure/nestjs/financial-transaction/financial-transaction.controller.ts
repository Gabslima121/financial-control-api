import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateFinancialTransactionUseCase } from 'src/application/financial-transaction/create-financial-transaction.use-case';
import { ListFinancialTransactionsUseCase } from 'src/application/financial-transaction/list-financial-transactions.use-case';
import { CreateFinancialTransactionDTO } from './dto/create-financial-transaction.dto';
import { ListFinancialTransactionsQueryDTO } from './dto/list-financial-transactions-query.dto';
import { CurrentUser } from '../utils/decorators/user.decorator';
import { AuthenticatedUser } from '../utils/types/express';

@ApiTags('Financial Control - Financial Transaction')
@Controller('financial-transaction')
export class FinancialTransactionController {
  constructor(
    private readonly createFinancialTransactionUseCase: CreateFinancialTransactionUseCase,
    private readonly listFinancialTransactionsUseCase: ListFinancialTransactionsUseCase,
  ) {}

  @Post()
  async create(
    @Body() params: CreateFinancialTransactionDTO,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.createFinancialTransactionUseCase.execute(
      params,
      user.accountId,
    );
  }

  @Get()
  async list(
    @Query() query: ListFinancialTransactionsQueryDTO,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.listFinancialTransactionsUseCase.execute(
      user.accountId,
      {
        type: query.type,
        status: query.status,
        startDate: query.startDate ? new Date(query.startDate) : undefined,
        endDate: query.endDate ? new Date(query.endDate) : undefined,
      },
      {
        page: query.page ?? 1,
        limit: query.limit ?? 20,
      },
    );
  }
}
