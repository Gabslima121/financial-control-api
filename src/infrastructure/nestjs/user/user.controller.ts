import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateUserUseCase } from "src/application/user/create-user.use-case";
import { CreateUserDTO } from "./dto/create-user.dto";

@ApiTags('Financial Control - User')
@Controller('user')
export class UserController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
    ) {}

    @Post('create')
    async createUser(@Body() user: CreateUserDTO) {
        return this.createUserUseCase.execute(user);
    }
}
