import { Module } from "@nestjs/common";
import { AccountController } from "./account.controller";
import { CreateAccountUseCase } from "src/application/account/create-account.use-case";
import { AccountRepository } from "src/infrastructure/adapters/account/out/account.impl";
import { PrismaProvider } from "../utils/providers/prisma.provider";
import { UserModule } from "../user/user.module";
import { UserRepository } from "src/infrastructure/adapters/user/out/user.impl";


@Module({
    imports: [UserModule],
    controllers: [AccountController],
    providers: [
        PrismaProvider,
        {
            provide: 'AccountPort',
            useClass: AccountRepository,
        },
        {
            provide: CreateAccountUseCase,
            useFactory: (accountRepository: AccountRepository, userRepository: UserRepository) => new CreateAccountUseCase(accountRepository, userRepository),
            inject: ['AccountPort', 'UserPort'],
        }
    ],
    exports: ['AccountPort'],
})
export class AccountModule {}
