import { forwardRef, Module } from '@nestjs/common';
import { BankStatementTransactionController } from './bank-statement-transaction.controller';
import { BankStatementTransactionRepository } from 'src/infrastructure/adapters/bank-statement-transaction/out/bank-statement-transaction.impl';
import { CreateBankStatementTransactionUseCase } from 'src/application/bank-statement-transaction/create-bank-statement-transaction.use-case';
import { PrismaProvider } from '../utils/providers/prisma.provider';
import { AccountModule } from '../account/account.module';
import { AccountRepository } from 'src/infrastructure/adapters/account/out/account.impl';
import { FinancialTransactionModule } from '../financial-transaction/financial-transaction.module';
import { FinancialTransactionRepository } from 'src/infrastructure/adapters/financial-transaction/out/financial-transaction.impl';

@Module({
  imports: [forwardRef(() => AccountModule), FinancialTransactionModule],
  providers: [
    PrismaProvider,
    {
      provide: 'BankStatementTransactionPort',
      useClass: BankStatementTransactionRepository,
    },
    {
      provide: CreateBankStatementTransactionUseCase,
      useFactory: (
        bankStatementTransactionRepository: BankStatementTransactionRepository,
        accountRepository: AccountRepository,
        financialTransactionRepository: FinancialTransactionRepository,
      ) => {
        return new CreateBankStatementTransactionUseCase(
          bankStatementTransactionRepository,
          accountRepository,
          financialTransactionRepository,
        );
      },
      inject: [
        'BankStatementTransactionPort',
        'AccountPort',
        'FinancialTransactionPort',
      ],
    },
  ],
  controllers: [BankStatementTransactionController],
  exports: ['BankStatementTransactionPort'],
})
export class BankStatementTransactionModule {}
