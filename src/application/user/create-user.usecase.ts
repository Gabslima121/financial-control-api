import { ConflictException } from "@nestjs/common";
import { UserPort } from "../../core/port/user.port";
import { UserDomainAdapter } from "../../infrastructure/adapters/user/in/user.domain.adapter";
import { UserInput } from "../../infrastructure/nestjs/body-inputs/user/user.input";

export class CreateUserUseCase {
  constructor(private readonly userPort: UserPort) {}

  async execute(userInput: UserInput) {
    const userExists = await this.userPort.listUserByEmail(userInput.email);

    if (userExists) {
      throw new ConflictException('User already exists');
    }

    const domain = UserDomainAdapter.toDomain({
      email: userInput.email,
      userDocument: userInput.userDocument,
      userName: userInput.name,
      isActive: true,
    })

    return this.userPort.createUser(domain);
  }
}