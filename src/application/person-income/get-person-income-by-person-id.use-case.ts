import { PersonIncomePort } from 'src/core/port/person-income.port';
import { FindPersonById } from '../person/find-person-by-id.use-case';
import { NotFoundException } from 'src/shared/errors/custom.exception';

export class GetPersonIncomeByPersonIdUseCase {
  constructor(
    private readonly personIncomePort: PersonIncomePort,
    private readonly findPersonById: FindPersonById,
  ) {}

  async execute(personId: string) {
    const person = await this.findPersonById.execute(personId);

    const personIncome = await this.personIncomePort.getIncomeByPersonId(
      person.getId(),
    );

    if (!personIncome) {
      throw new NotFoundException('No income found for this person');
    }

    return personIncome;
  }
}
