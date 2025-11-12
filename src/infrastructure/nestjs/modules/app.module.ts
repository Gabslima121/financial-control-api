import { MiddlewareConsumer, Module } from '@nestjs/common';
import { JwtTokenValidatorRepository } from '../../adapters/auth/out/jwt-token-validator.repository';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { UsersModule } from '../modules/users.module';
import { CategoryModule } from './category.module';

@Module({
  providers: [
    { provide: 'TokenValidatorPort', useClass: JwtTokenValidatorRepository },
  ],
  imports: [
    UsersModule,
    CategoryModule
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
