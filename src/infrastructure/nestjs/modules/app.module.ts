import { MiddlewareConsumer, Module } from '@nestjs/common';
import { JwtTokenValidatorRepository } from '../../adapters/auth/out/jwt-token-validator.repository';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { UsersModule } from '../modules/users.module';
import { CategoryModule } from './category.module';
import { TransactionModule } from './transaction.module';

@Module({
  providers: [
    { provide: 'TokenValidatorPort', useClass: JwtTokenValidatorRepository },
  ],
  imports: [
    UsersModule,
    CategoryModule,
    TransactionModule
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
