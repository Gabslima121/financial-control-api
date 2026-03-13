import { PersonPort } from 'src/core/port/person.port';
import { PersonAdapter } from 'src/infrastructure/adapters/person/in/person.adapter';
import { CreatePersonDTO } from 'src/infrastructure/nestjs/person/dto/create-person.dto';

export class CreatePersonUseCase {
  constructor(private readonly personPort: PersonPort) {}

  async execute(createPersonDto: CreatePersonDTO) {
    const personDomain = PersonAdapter.toDomain({
      name: createPersonDto.name,
      email: createPersonDto.email,
    });

    await this.personPort.createPerson(personDomain);
  }
}
