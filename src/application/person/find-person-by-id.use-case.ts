import { PersonPort } from 'src/core/port/person.port';
import { NotFoundException } from 'src/shared/errors/custom.exception';

export class FindPersonById {
  constructor(private readonly personPort: PersonPort) {}

  async execute(id: string) {
    const personExists = await this.personPort.findPersonById(id);

    if (!personExists) {
      throw new NotFoundException('Person not found');
    }

    return personExists;
  }
}
