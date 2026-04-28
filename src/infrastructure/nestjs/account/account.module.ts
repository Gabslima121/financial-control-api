import { forwardRef, Module } from '@nestjs/common';
import { CreateAccountUseCase } from 'src/application/account/create-account.use-case';
import { GetCurrentBalanceUseCase } from 'src/application/account/get-current-balance.use-case';
import { ProjectBalanceWithPendingTransactionsUseCase } from 'src/application/account/project-balance-with-pending-transactions.use-case';
import { AccountRepository } from 'src/infrastructure/adapters/account/out/account.impl';
import { BankStatementTransactionRepository } from 'src/infrastructure/adapters/bank-statement-transaction/out/bank-statement-transaction.impl';
import { FinancialTransactionRepository } from 'src/infrastructure/adapters/financial-transaction/out/financial-transaction.impl';
import { UserRepository } from 'src/infrastructure/adapters/user/out/user.impl';
import { GetUserAccountsUseCase } from '../../../application/account/get-user-accounts.use-case';
import { BankStatementTransactionModule } from '../bank-statement-transaction/bank-statement-transaction.module';
import { FinancialTransactionModule } from '../financial-transaction/financial-transaction.module';
import { UserModule } from '../user/user.module';
import { PrismaProvider } from '../utils/providers/prisma.provider';
import { AccountController } from './account.controller';

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
    {
      provide: GetUserAccountsUseCase,
      useFactory: (accountRepository: AccountRepository) =>
        new GetUserAccountsUseCase(accountRepository),
      inject: ['AccountPort'],
    },
  ],
  exports: ['AccountPort'],
})
export class AccountModule {}
