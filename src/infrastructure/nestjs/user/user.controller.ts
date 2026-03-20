import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserUseCase } from 'src/application/user/create-user.use-case';
import { LoginUserUseCase } from 'src/application/user/login-user.use-case';
import { RefreshTokenUseCase } from 'src/application/user/refresh-token.use-case';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { RefreshTokenDTO } from './dto/refresh-token.dto';

@ApiTags('Financial Control - User')
@Controller('user')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  @Post('create')
  async createUser(@Body() user: CreateUserDTO) {
    return this.createUserUseCase.execute(user);
  }

  @Post('login')
  async loginUser(@Body() user: LoginUserDTO) {
    return this.loginUserUseCase.execute(user.email, user.password);
  }

  @Post('refresh-token')
  async refreshToken(@Body() body: RefreshTokenDTO) {
    return this.refreshTokenUseCase.execute(body.refreshToken);
  }
}
