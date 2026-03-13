import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { JwtTokenValidatorRepository } from '../adapters/auth/out/jwt-token-validator.repository';
import { AuthMiddleware } from './utils/middlewares/auth.middleware';
import { UserModule } from './user/user.module';
import { AccountModule } from './account/account.module';
import { BankStatementTransactionModule } from './bank-statement-transaction/bank-statement-transaction.module';
import { FinancialTransactionModule } from './financial-transaction/financial-transaction.module';
import { PersonModule } from './person/person.module';
import { PersonIncomeModule } from './person-income/person-income.module';

@Module({
  providers: [
    { provide: 'TokenValidatorPort', useClass: JwtTokenValidatorRepository },
  ],
  imports: [
    UserModule,
    AccountModule,
    BankStatementTransactionModule,
    FinancialTransactionModule,
    PersonModule,
    PersonIncomeModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/user/login', method: RequestMethod.POST },
        { path: 'api-docs', method: RequestMethod.ALL },
      )
      .forRoutes('*');
  }
}
