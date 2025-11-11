import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserUseCase } from '../../../application/user/create-user.usecase';
import { UserInput } from '../body-inputs/user/user.input';

@ApiTags('Financial Control - User')
@Controller('user')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  async create(@Body() userInput: UserInput) {
    return this.createUserUseCase.execute(userInput);
  }
}
