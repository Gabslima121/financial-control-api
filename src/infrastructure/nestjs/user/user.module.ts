import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserRepository } from "src/infrastructure/adapters/user/out/user.impl";
import { PrismaProvider } from "../utils/providers/prisma.provider";
import { CreateUserUseCase } from "src/application/user/create-user.use-case";
import { UserPort } from "src/core/port/user.port";
import { LoginUserUseCase } from "src/application/user/login-user.use-case";
import { TokenValidatorPort } from "src/core/port/token-validator.port";
import { JwtTokenValidatorRepository } from "src/infrastructure/adapters/auth/out/jwt-token-validator.repository";

@Module({
    providers: [
        PrismaProvider,
        {
            provide: 'UserPort',
            useClass: UserRepository,
        },
        {
            provide: 'TokenValidatorPort',
            useClass: JwtTokenValidatorRepository,
        },
        {
            provide: CreateUserUseCase,
            useFactory: (userPort: UserPort) => new CreateUserUseCase(userPort),
            inject: ['UserPort'],
        },
        {
            provide: LoginUserUseCase,
            useFactory: (userPort: UserPort, tokenValidatorPort: TokenValidatorPort) => new LoginUserUseCase(userPort, tokenValidatorPort),
            inject: ['UserPort', 'TokenValidatorPort'],
        },
    ],
    imports: [],
    controllers: [UserController],
    exports: ['UserPort'],
})
export class UserModule {}