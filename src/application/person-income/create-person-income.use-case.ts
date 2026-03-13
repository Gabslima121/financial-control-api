import { PersonIncomePort } from 'src/core/port/person-income.port';
import { PersonIncomeAdapter } from 'src/infrastructure/adapters/person-income/in/person-income.adapter';
import { CreatePersonIncomeDTO } from 'src/infrastructure/nestjs/person-income/dto/create-person-income.dto';
import { FindPersonById } from '../person/find-person-by-id.use-case';
import { RecurrenceFrequency } from 'src/core/domain/financial-transaction/dto';

export class CreatePersonIncomeUseCase {
  constructor(
    private readonly personIncomePort: PersonIncomePort,
    private readonly findPersonById: FindPersonById,
  ) {}

  async execute(createPersonIncomeDto: CreatePersonIncomeDTO) {
    const person = await this.findPersonById.execute(
      createPersonIncomeDto.personId,
    );

    const personIncomeDomain = PersonIncomeAdapter.toDomain({
      person,
      amount: createPersonIncomeDto.amount,
      frequency: createPersonIncomeDto.frequency as RecurrenceFrequency,
    });

    await this.personIncomePort.createPersonIncome(personIncomeDomain);
  }
}
