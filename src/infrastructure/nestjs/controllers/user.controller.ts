import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserUseCase } from '../../../application/user/create-user.usecase';
import { LoginUserUseCase } from '../../../application/user/login-user.usecase';
import { LoginUserInput } from '../body-inputs/user/login-user.input';
import { UserInput } from '../body-inputs/user/user.input';
import { CurrentUser } from '../decorators/user.decorator';
import { AuthenticatedUser } from '../types/express';

@ApiTags('Financial Control - User')
@Controller('user')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async create(@Body() userInput: UserInput) {
    return this.createUserUseCase.execute(userInput);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() userInput: LoginUserInput) {
    return this.loginUserUseCase.execute(userInput);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get authenticated user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@CurrentUser() user: AuthenticatedUser) {
    return {
      user: {
        ...user,
      },
    };
  }
}
