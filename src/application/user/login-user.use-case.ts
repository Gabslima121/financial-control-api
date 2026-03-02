import { TokenValidatorPort } from "src/core/port/token-validator.port";
import { UserPort } from "src/core/port/user.port";

export class LoginUserUseCase {
    constructor(
        private readonly userPort: UserPort,
        private readonly tokenValidatorPort: TokenValidatorPort,
    ) {}

    async execute(email: string, password: string) {
        const userExists = await this.userPort.findUserByEmail(email);

        if (!userExists) {
            throw new Error("User not found");
        }

        const isPasswordValid = await this.userPort.decryptPassword(password, userExists.getPassword());

        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }

        const token = await this.tokenValidatorPort.createToken({ id: userExists.getId() });

        return { token };
    }
}