import { UserPort } from "src/core/port/user.port";
import { UserDomainAdapter } from "src/infrastructure/adapters/user/in/user.adapter";
import { CreateUserDTO } from "src/infrastructure/nestjs/user/dto/create-user.dto";

export class CreateUserUseCase {
    constructor(private readonly userPort: UserPort) {}

    async execute(userDto: CreateUserDTO) {
        const userExists = await this.userPort.findUserByEmail(userDto.email);

        if (userExists) {
            throw new Error("User already exists");
        }

        const encryptedPassword = await this.userPort.encryptPassword(userDto.password);

        const userDomainToCreate = UserDomainAdapter.toDomain({
            email: userDto.email,
            userName: userDto.name,
            userDocument: userDto.document,
            password: encryptedPassword,
            isActive: true,
        });

        return this.userPort.createUser(userDomainToCreate);
    }
}