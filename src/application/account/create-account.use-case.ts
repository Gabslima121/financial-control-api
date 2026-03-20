import { Injectable } from '@nestjs/common';
import { AccountPort } from 'src/core/port/account.port';
import { UserPort } from 'src/core/port/user.port';
import { AccountDomainAdapter } from 'src/infrastructure/adapters/account/in/account.adapter';
import { CreateAccountDTO } from 'src/infrastructure/nestjs/account/dto/create-account.dto';

@Injectable()
export class CreateAccountUseCase {
  constructor(
    private readonly accountRepository: AccountPort,
    private readonly userRepository: UserPort,
  ) {}

  async execute(createAccountDto: CreateAccountDTO, userId: string) {
    const userExists = await this.userRepository.findById(userId);

    if (!userExists) {
      throw new Error('User not found');
    }

    const accoutDomain = AccountDomainAdapter.toDomain({
      bankName: createAccountDto.bankName,
      name: createAccountDto.name,
      initialBalance: createAccountDto.initialBalance,
      user: userExists,
    });

    return this.accountRepository.createAccount(accoutDomain);
  }
}
