import { forwardRef, Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { CreateAccountUseCase } from 'src/application/account/create-account.use-case';
import { AccountRepository } from 'src/infrastructure/adapters/account/out/account.impl';
import { PrismaProvider } from '../utils/providers/prisma.provider';
import { UserModule } from '../user/user.module';
import { UserRepository } from 'src/infrastructure/adapters/user/out/user.impl';
import { GetCurrentBalanceUseCase } from 'src/application/account/get-current-balance.use-case';
import { BankStatementTransactionRepository } from 'src/infrastructure/adapters/bank-statement-transaction/out/bank-statement-transaction.impl';
import { BankStatementTransactionModule } from '../bank-statement-transaction/bank-statement-transaction.module';
import { ProjectBalanceWithPendingTransactionsUseCase } from 'src/application/account/project-balance-with-pending-transactions.use-case';
import { FinancialTransactionModule } from '../financial-transaction/financial-transaction.module';
import { FinancialTransactionRepository } from 'src/infrastructure/adapters/financial-transaction/out/financial-transaction.impl';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => BankStatementTransactionModule),
    forwardRef(() => FinancialTransactionModule),
  ],
  controllers: [AccountController],
  providers: [
    PrismaProvider,
    {
      provide: 'AccountPort',
      useClass: AccountRepository,
    },
    {
      provide: CreateAccountUseCase,
      useFactory: (
        accountRepository: AccountRepository,
        userRepository: UserRepository,
      ) => new CreateAccountUseCase(accountRepository, userRepository),
      inject: ['AccountPort', 'UserPort'],
    },
    {
      provide: GetCurrentBalanceUseCase,
      useFactory: (
        accountRepository: AccountRepository,
        bankStatementTransactionRepository: BankStatementTransactionRepository,
      ) =>
        new GetCurrentBalanceUseCase(
          accountRepository,
          bankStatementTransactionRepository,
        ),
      inject: ['AccountPort', 'BankStatementTransactionPort'],
    },
    {
      provide: ProjectBalanceWithPendingTransactionsUseCase,
      useFactory: (
        getCurrentBalanceUseCase: GetCurrentBalanceUseCase,
        financialTransactionRepository: FinancialTransactionRepository,
      ) =>
        new ProjectBalanceWithPendingTransactionsUseCase(
          getCurrentBalanceUseCase,
          financialTransactionRepository,
        ),
      inject: [GetCurrentBalanceUseCase, 'FinancialTransactionPort'],
    },
  ],
  exports: ['AccountPort'],
})
export class AccountModule {}
