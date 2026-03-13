import {
  BadRequestException,
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateBankStatementTransactionUseCase } from 'src/application/bank-statement-transaction/create-bank-statement-transaction.use-case';

@ApiTags('Financial Control -Bank Statement Transaction')
@Controller('bank-statement-transaction')
export class BankStatementTransactionController {
  constructor(
    private readonly createBankStatementTransactionUseCase: CreateBankStatementTransactionUseCase,
  ) {}

  @Post(':accountId/import-ofx')
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
    },
  })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Param('accountId') accountId: string,
  ) {
    if (!file) {
      throw new BadRequestException('Arquivo não enviado');
    }

    if (!file.originalname.endsWith('.ofx')) {
      throw new BadRequestException('Arquivo precisa ser OFX');
    }

    return this.createBankStatementTransactionUseCase.execute({
      accountId,
      file: file.buffer,
    });
  }
}
