import { NotFoundException } from 'src/shared/errors/custom.exception';
import { PersonIncomePort } from 'src/core/port/person-income.port';

export class GetPersonIncomeByIdUseCase {
  constructor(private readonly personIncomePort: PersonIncomePort) {}

  async execute(id: string) {
    const personIncome = await this.personIncomePort.getIncomeById(id);

    if (!personIncome) {
      throw new NotFoundException('No income found');
    }

    return personIncome;
  }
}
