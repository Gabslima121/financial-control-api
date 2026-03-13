import { PersonDomainDTO } from 'src/core/domain/person/dto';
import { PersonDomain } from 'src/core/domain/person/person.domain';

export class PersonAdapter {
  public static toDomain(personInformation: PersonDomainDTO): PersonDomain {
    return PersonDomain.create(personInformation);
  }

  public static toDTO(personDomain: PersonDomain): PersonDomainDTO {
    return {
      id: personDomain.getId(),
      name: personDomain.getName(),
      email: personDomain.getEmail(),
    };
  }
}
