import { forwardRef, Module } from '@nestjs/common';
import { PrismaProvider } from '../utils/providers/prisma.provider';
import { FinancialTransactionRepository } from 'src/infrastructure/adapters/financial-transaction/out/financial-transaction.impl';
import { CreateFinancialTransactionUseCase } from 'src/application/financial-transaction/create-financial-transaction.use-case';
import { ListFinancialTransactionsUseCase } from 'src/application/financial-transaction/list-financial-transactions.use-case';
import { FinancialTransactionPort } from 'src/core/port/financial-transaction.port';
import { FinancialTransactionController } from './financial-transaction.controller';
import { AccountPort } from 'src/core/port/account.port';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [forwardRef(() => AccountModule)],
  providers: [
    PrismaProvider,
    {
      provide: 'FinancialTransactionPort',
      useClass: FinancialTransactionRepository,
    },
    {
      provide: CreateFinancialTransactionUseCase,
      useFactory: (
        financialTransactionPort: FinancialTransactionPort,
        accountPort: AccountPort,
      ) =>
        new CreateFinancialTransactionUseCase(
          financialTransactionPort,
          accountPort,
        ),
      inject: ['FinancialTransactionPort', 'AccountPort'],
    },
    {
      provide: ListFinancialTransactionsUseCase,
      useFactory: (
        financialTransactionPort: FinancialTransactionPort,
        accountPort: AccountPort,
      ) =>
        new ListFinancialTransactionsUseCase(
          financialTransactionPort,
          accountPort,
        ),
      inject: ['FinancialTransactionPort', 'AccountPort'],
    },
  ],
  exports: ['FinancialTransactionPort'],
  controllers: [FinancialTransactionController],
})
export class FinancialTransactionModule {}
