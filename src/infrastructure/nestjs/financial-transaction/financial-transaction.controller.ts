import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateFinancialTransactionUseCase } from "src/application/financial-transaction/create-financial-transaction.use-case";
import { CreateFinancialTransactionDTO } from "./dto/create-financial-transaction.dto";
import { CurrentUser } from "../utils/decorators/user.decorator";
import { AuthenticatedUser } from "../utils/types/express";

@ApiTags('Financial Control - Financial Transaction')
@Controller('financial-transaction')
export class FinancialTransactionController {
    constructor(
        private readonly createFinancialTransactionUseCase: CreateFinancialTransactionUseCase,
    ) {}

    @Post()
    async create(
        @Body() params: CreateFinancialTransactionDTO,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        await this.createFinancialTransactionUseCase.execute(params, user.accountId);
    }
}