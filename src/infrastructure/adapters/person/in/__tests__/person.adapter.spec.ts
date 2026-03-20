import { PersonDomain } from 'src/core/domain/person/person.domain';
import { PersonAdapter } from '../person.adapter';

const VALID_UUID = 'a1b2c3d4-e5f6-4789-8abc-def012345678';

describe('PersonAdapter', () => {
  describe('toDomain()', () => {
    it('deve converter DTO para domínio', () => {
      const domain = PersonAdapter.toDomain({
        id: VALID_UUID,
        name: 'Gabriel',
        email: 'gabriel@email.com',
      });

      expect(domain).toBeInstanceOf(PersonDomain);
      expect(domain.getId()).toBe(VALID_UUID);
      expect(domain.getName()).toBe('Gabriel');
      expect(domain.getEmail()).toBe('gabriel@email.com');
    });

    it('deve gerar UUID quando id não é fornecido', () => {
      const domain = PersonAdapter.toDomain({
        name: 'Gabriel',
        email: 'gabriel@email.com',
      });

      expect(domain.getId()).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
    });
  });

  describe('toDTO()', () => {
    it('deve converter domínio para DTO', () => {
      const domain = PersonDomain.create({
        id: VALID_UUID,
        name: 'Gabriel',
        email: 'gabriel@email.com',
      });

      const dto = PersonAdapter.toDTO(domain);

      expect(dto.id).toBe(VALID_UUID);
      expect(dto.name).toBe('Gabriel');
      expect(dto.email).toBe('gabriel@email.com');
    });
  });

  describe('round-trip', () => {
    it('deve preservar os valores em toDomain → toDTO', () => {
      const original = {
        id: VALID_UUID,
        name: 'Gabriel',
        email: 'gabriel@email.com',
      };

      const dto = PersonAdapter.toDTO(PersonAdapter.toDomain(original));

      expect(dto.id).toBe(original.id);
      expect(dto.name).toBe(original.name);
      expect(dto.email).toBe(original.email);
    });
  });
});
