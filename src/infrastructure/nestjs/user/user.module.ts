import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserRepository } from "src/infrastructure/adapters/user/out/user.impl";
import { PrismaProvider } from "../utils/providers/prisma.provider";
import { CreateUserUseCase } from "src/application/user/create-user.use-case";
import { UserPort } from "src/core/port/user.port";

@Module({
    providers: [
        PrismaProvider,
        {
            provide: 'UserPort',
            useClass: UserRepository,
        },
        {
            provide: CreateUserUseCase,
            useFactory: (userPort: UserPort) => new CreateUserUseCase(userPort),
            inject: ['UserPort'],
        },
    ],
    imports: [],
    controllers: [UserController],
})
export class UserModule {}