import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CalculateSplitPaymentUseCase } from '../../../application/expense-split-rule/calculate-split-payment.use-case';
import { CreateExpenseSplitRuleUseCase } from '../../../application/expense-split-rule/create-expense-split-rule.use-case';
import { CurrentUser } from '../utils/decorators/user.decorator';
import { AuthenticatedUser } from '../utils/types/express';
import { CreateExpenseSplitRuleDTO } from './dto/create-expense-split-rule.dto';

@ApiTags('Financial Control - Expense Split Rule')
@Controller('expense-split-rules')
export class ExpenseSplitRuleController {
  constructor(
    private readonly createExpenseSplitRuleUseCase: CreateExpenseSplitRuleUseCase,
    private readonly calculateSplitPaymentUseCase: CalculateSplitPaymentUseCase,
  ) {}

  @Post()
  async createExpenseSplitRule(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateExpenseSplitRuleDTO,
  ) {
    await this.createExpenseSplitRuleUseCase.execute(dto, user.accountId);
  }

  @Get('calculate-split/:splitRuleId/transaction/:financialTransactionId')
  async calculateSplitPayment(
    @Param('splitRuleId') splitRuleId: string,
    @Param('financialTransactionId') financialTransactionId: string,
  ) {
    return this.calculateSplitPaymentUseCase.execute(
      splitRuleId,
      financialTransactionId,
    );
  }
}
