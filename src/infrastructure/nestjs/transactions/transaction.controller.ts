import { Controller, Post, UploadedFile, UseInterceptors, Req } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateTransactionUseCase } from "src/application/transactions/create-transaction.use-case";

@ApiTags('Financial Control - Transactions')
@Controller('transactions')
export class TransactionController {
    constructor(private readonly createTransactionUseCase: CreateTransactionUseCase) {}

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
        @Req() req: any,
    ) {
        const ofxContent = file?.buffer?.toString('utf8') ?? '';
        const userId = req.user?.id as string;

        await this.createTransactionUseCase.execute(ofxContent, userId);
    }
}
