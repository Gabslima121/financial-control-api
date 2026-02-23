import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { JwtTokenValidatorRepository } from '../adapters/auth/out/jwt-token-validator.repository';
import { AuthMiddleware } from './utils/middlewares/auth.middleware';
import { UserModule } from './user/user.module';

@Module({
  providers: [
    { provide: 'TokenValidatorPort', useClass: JwtTokenValidatorRepository },
  ],
  imports: [UserModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/user/login', method: RequestMethod.POST },
        { path: 'api-docs', method: RequestMethod.ALL },
        { path: '/user/create', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
