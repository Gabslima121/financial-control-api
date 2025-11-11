import { ConflictException } from '@nestjs/common';
import { UserPort } from '../../core/port/user.port';
import { UserDomainAdapter } from '../../infrastructure/adapters/user/in/user.domain.adapter';
import { UserOutput } from '../../infrastructure/adapters/user/out/dto';
import { UserInput } from '../../infrastructure/nestjs/body-inputs/user/user.input';

export class CreateUserUseCase {
  constructor(private readonly userPort: UserPort) {}

  async execute(userInput: UserInput): Promise<UserOutput> {
    const userExists = await this.userPort.listUserByEmail(userInput.email);

    if (userExists) {
      throw new ConflictException('User already exists');
    }

    const domain = UserDomainAdapter.toDomain({
      email: userInput.email,
      userDocument: userInput.userDocument,
      userName: userInput.name,
      isActive: true,
    });

    const createdUser = await this.userPort.createUser(domain);

    return {
      name: createdUser.getUserName(),
      email: createdUser.getEmail(),
      userDocument: createdUser.getUserDocument().getValue(),
    };
  }
}
