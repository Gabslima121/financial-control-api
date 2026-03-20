import { Module } from '@nestjs/common';
import { CreateExpenseSplitRuleUseCase } from '../../../application/expense-split-rule/create-expense-split-rule.use-case';
import { AccountPort } from '../../../core/port/account.port';
import { ExpenseSplitRulePort } from '../../../core/port/expense-split-rule.port';
import { PersonPort } from '../../../core/port/person.port';
import { ExpenseSplitRuleRepository } from '../../adapters/expense-split-rule/out/expense-split-rule.impl';
import { AccountModule } from '../account/account.module';
import { PersonModule } from '../person/person.module';
import { PrismaProvider } from '../utils/providers/prisma.provider';
import { ExpenseSplitRuleController } from './expense-split-rule.controller';

@Module({
  imports: [AccountModule, PersonModule],
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
  ],
})
export class ExpenseSplitRuleModule {}
