import { UserDomain } from 'src/core/domain/user/user.domain';
import { UserDomainAdapter } from '../user.adapter';

const VALID_UUID = 'a1b2c3d4-e5f6-4789-8abc-def012345678';
const VALID_CPF = '11144477735';

const baseDTO = {
  id: VALID_UUID,
  name: 'Gabriel Lima',
  document: VALID_CPF,
  email: 'gabriel@email.com',
  password: 'hashed_password',
  isActive: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-02'),
};

describe('UserDomainAdapter', () => {
  describe('toDomain()', () => {
    it('deve converter DTO para domínio', () => {
      const domain = UserDomainAdapter.toDomain(baseDTO);

      expect(domain).toBeInstanceOf(UserDomain);
      expect(domain.getId()).toBe(VALID_UUID);
      expect(domain.getName()).toBe('Gabriel Lima');
      expect(domain.getDocument()).toBe(VALID_CPF);
      expect(domain.getEmail()).toBe('gabriel@email.com');
      expect(domain.getPassword()).toBe('hashed_password');
      expect(domain.getIsActive()).toBe(true);
    });
  });

  describe('toDTO()', () => {
    it('deve converter domínio para DTO', () => {
      const domain = UserDomain.create(baseDTO);
      const dto = UserDomainAdapter.toDTO(domain);

      expect(dto.id).toBe(VALID_UUID);
      expect(dto.name).toBe('Gabriel Lima');
      expect(dto.document).toBe(VALID_CPF);
      expect(dto.email).toBe('gabriel@email.com');
      expect(dto.password).toBe('hashed_password');
      expect(dto.isActive).toBe(true);
      expect(dto.createdAt).toEqual(new Date('2024-01-01'));
      expect(dto.updatedAt).toEqual(new Date('2024-01-02'));
    });
  });

  describe('round-trip', () => {
    it('deve preservar os valores em toDomain → toDTO', () => {
      const dto = UserDomainAdapter.toDTO(UserDomainAdapter.toDomain(baseDTO));

      expect(dto.id).toBe(baseDTO.id);
      expect(dto.name).toBe(baseDTO.name);
      expect(dto.document).toBe(baseDTO.document);
      expect(dto.email).toBe(baseDTO.email);
      expect(dto.isActive).toBe(baseDTO.isActive);
    });
  });
});
