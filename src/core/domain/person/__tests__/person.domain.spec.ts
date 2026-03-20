import { PersonDomain } from '../person.domain';

const VALID_UUID = 'a1b2c3d4-e5f6-4789-8abc-def012345678';

describe('PersonDomain', () => {
  describe('create()', () => {
    it('deve criar uma pessoa com id fornecido', () => {
      const person = PersonDomain.create({
        id: VALID_UUID,
        name: 'Gabriel',
        email: 'gabriel@email.com',
      });
      expect(person.getId()).toBe(VALID_UUID);
    });

    it('deve gerar um UUID quando id não é fornecido', () => {
      const person = PersonDomain.create({
        name: 'Gabriel',
        email: 'gabriel@email.com',
      });
      expect(person.getId()).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
    });
  });

  describe('getters', () => {
    let person: PersonDomain;

    beforeEach(() => {
      person = PersonDomain.create({
        id: VALID_UUID,
        name: 'Gabriel Lima',
        email: 'gabriel@email.com',
      });
    });

    it('deve retornar o nome', () => {
      expect(person.getName()).toBe('Gabriel Lima');
    });

    it('deve retornar o email', () => {
      expect(person.getEmail()).toBe('gabriel@email.com');
    });
  });
});
