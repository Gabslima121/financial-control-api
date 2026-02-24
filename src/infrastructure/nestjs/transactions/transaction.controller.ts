import { Controller, Post, UploadedFile, UseInterceptors, Req, Get, Query, Body } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateTransactionUseCase } from "src/application/transactions/create-transaction.use-case";
import { CurrentUser } from "../utils/decorators/user.decorator";
import { AuthenticatedUser } from "../utils/types/express";
import { GetTransactionsByPeriodUseCase } from "src/application/transactions/get-transactions-by-period.use-case";
import { CreateFutureTransactionUseCase } from "src/application/transactions/create-future-transactions.use-case";
import { CreateTransactionsDTO } from "./dto/create-transactions.dto";

@ApiTags('Financial Control - Transactions')
@Controller('transactions')
export class TransactionController {
    constructor(
        private readonly createTransactionUseCase: CreateTransactionUseCase,
        private readonly getTransactionsByPeriodUseCase: GetTransactionsByPeriodUseCase,
        private readonly createFutureTransactionUseCase: CreateFutureTransactionUseCase,
    ) {}

    @Post('import-transactions')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
            required: ['file'],
        },
    })
    async importTransactions(
        @UploadedFile() file: any,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        const ofxContent = file?.buffer?.toString('utf8') ?? '';

        await this.createTransactionUseCase.execute(ofxContent, user.id);
    }

    @Get('by-period')
    async getTransactionsByPeriod(
        @CurrentUser() user: AuthenticatedUser,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ) {
        return this.getTransactionsByPeriodUseCase.execute(user.id, startDate, endDate);
    }

    @Post('future-transactions')
    async createFutureTransactions(
        @CurrentUser() user: AuthenticatedUser,
        @Body() body: CreateTransactionsDTO,
    ) {
        await this.createFutureTransactionUseCase.execute(body, user.id);
    }
}
