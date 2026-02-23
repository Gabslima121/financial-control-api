import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { JwtTokenValidatorRepository } from '../adapters/auth/out/jwt-token-validator.repository';
import { AuthMiddleware } from './utils/middlewares/auth.middleware';
import { UserModule } from './user/user.module';
import { TransactionModule } from './transactions/transaction.module';
import { AccountBalanceModule } from './account-balance/account-balance.module';

@Module({
  providers: [
    { provide: 'TokenValidatorPort', useClass: JwtTokenValidatorRepository },
  ],
  imports: [
    UserModule,
    TransactionModule,
    AccountBalanceModule
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/user/login', method: RequestMethod.POST },
        { path: 'api-docs', method: RequestMethod.ALL }
      )
      .forRoutes('*');
  }
}
