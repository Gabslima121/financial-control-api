import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateAccountUseCase } from "src/application/account/create-account.use-case";
import { CreateAccountDTO } from "./dto/create-account.dto";
import { CurrentUser } from "../utils/decorators/user.decorator";
import { AuthenticatedUser } from "../utils/types/express";

@ApiTags('Financial Control - Account')
@Controller('account')
export class AccountController {
  constructor(private readonly createAccountUseCase: CreateAccountUseCase) {}

  @Post()
  async createAccount(@Body() createAccountDto: CreateAccountDTO, @CurrentUser() user: AuthenticatedUser) {
    try {
      return await this.createAccountUseCase.execute(createAccountDto, user.id);
    } catch (error) {
      throw error;
    }
  }
}