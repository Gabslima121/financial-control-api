import { ApiTags } from '@nestjs/swagger';
import { CreatePersonIncomeUseCase } from 'src/application/person-income/create-person-income.use-case';

import { Controller, Post, Body } from '@nestjs/common';
import { CreatePersonIncomeDTO } from './dto/create-person-income.dto';

@ApiTags('Financial Control - Person Income')
@Controller('person-income')
export class PersonIncomeController {
  constructor(
    private readonly createPersonIncomeUseCase: CreatePersonIncomeUseCase,
  ) {}

  @Post()
  async createPersonIncome(
    @Body() createPersonIncomeDto: CreatePersonIncomeDTO,
  ) {
    await this.createPersonIncomeUseCase.execute(createPersonIncomeDto);
  }
}
