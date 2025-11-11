import { MiddlewareConsumer, Module } from '@nestjs/common';
import { JwtTokenValidatorRepository } from '../../adapters/auth/out/jwt-token-validator.repository';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { UsersModule } from '../modules/users.module';

@Module({
  providers:[
    { provide: 'TokenValidatorPort', useClass: JwtTokenValidatorRepository },
  ],
  imports: [UsersModule],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
