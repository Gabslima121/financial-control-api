import { Module } from '@nestjs/common';
import { CalculateSplitPaymentUseCase } from '../../../application/expense-split-rule/calculate-split-payment.use-case';
import { CreateExpenseSplitRuleUseCase } from '../../../application/expense-split-rule/create-expense-split-rule.use-case';
import { AccountPort } from '../../../core/port/account.port';
import { ExpenseSplitRulePort } from '../../../core/port/expense-split-rule.port';
import { FinancialTransactionPort } from '../../../core/port/financial-transaction.port';
import { PersonPort } from '../../../core/port/person.port';
import { ExpenseSplitRuleRepository } from '../../adapters/expense-split-rule/out/expense-split-rule.impl';
import { AccountModule } from '../account/account.module';
import { FinancialTransactionModule } from '../financial-transaction/financial-transaction.module';
import { PersonIncomeModule } from '../person-income/person-income.module';
import { PersonModule } from '../person/person.module';
import { PrismaProvider } from '../utils/providers/prisma.provider';
import { ExpenseSplitRuleController } from './expense-split-rule.controller';
import { GetPersonIncomeByPersonIdUseCase } from '../../../application/person-income/get-person-income-by-person-id.use-case';

@Module({
  imports: [
    AccountModule,
    PersonModule,
    FinancialTransactionModule,
    PersonIncomeModule,
  ],
  controllers: [ExpenseSplitRuleController],
  providers: [
    PrismaProvider,
    {
      provide: 'ExpenseSplitRulePort',
      useClass: ExpenseSplitRuleRepository,
    },
    {
      provide: CreateExpenseSplitRuleUseCase,
      useFactory: (
        expenseSplitRulePort: ExpenseSplitRulePort,
        accountPort: AccountPort,
        personPort: PersonPort,
      ) =>
        new CreateExpenseSplitRuleUseCase(
          expenseSplitRulePort,
          accountPort,
          personPort,
        ),
      inject: ['ExpenseSplitRulePort', 'AccountPort', 'PersonPort'],
    },
    {
      provide: CalculateSplitPaymentUseCase,
      useFactory: (
        financialTransactionPort: FinancialTransactionPort,
        expenseSplitRulePort: ExpenseSplitRulePort,
        getPersonIncomeByPersonId: GetPersonIncomeByPersonIdUseCase,
      ) =>
        new CalculateSplitPaymentUseCase(
          financialTransactionPort,
          expenseSplitRulePort,
          getPersonIncomeByPersonId,
        ),
      inject: [
        'FinancialTransactionPort',
        'ExpenseSplitRulePort',
        GetPersonIncomeByPersonIdUseCase,
      ],
    },
  ],
})
export class ExpenseSplitRuleModule {}
