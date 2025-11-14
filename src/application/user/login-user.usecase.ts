import { TokenValidatorPort } from "../../core/port/token-validator.port";
import { UserPort } from "../../core/port/user.port";
import { LoginUserInput } from "../../infrastructure/nestjs/body-inputs/user/login-user.input";
import { NotFoundException } from "../../shared/errors/custom.exception";

export class LoginUserUseCase {
  constructor(
    private readonly userPort: UserPort,
    private readonly tokenValidatorPort: TokenValidatorPort,
  ) {}

  async execute(loginUserInput: LoginUserInput) {
    const userExists = await this.userPort.listUserByEmail(loginUserInput.email);

    if (!userExists) {
      throw new NotFoundException('Wrong user or password information');
    }

    const isPasswordValid = await this.userPort.decryptPassword(loginUserInput.password, userExists.getPassword());

    if (!isPasswordValid) {
      throw new NotFoundException('Wrong user or password information');
    }

    const token = await this.tokenValidatorPort.createToken({ id: userExists.getUserId().getValue() });

    return { token };
  }
}