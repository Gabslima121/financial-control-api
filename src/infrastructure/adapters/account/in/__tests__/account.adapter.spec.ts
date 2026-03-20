import { AccountDomain } from 'src/core/domain/account/account.domain';
import { AccountDomainAdapter } from '../account.adapter';

const VALID_UUID = 'a1b2c3d4-e5f6-4789-8abc-def012345678';

const baseDTO = {
  id: VALID_UUID,
  name: 'Conta Principal',
  bankName: 'Nubank' as string | null,
  initialBalance: 1000,
  user: null,
  createdAt: new Date('2024-01-01'),
};

describe('AccountDomainAdapter', () => {
  describe('toDomain()', () => {
    it('deve converter DTO para domínio', () => {
      const domain = AccountDomainAdapter.toDomain(baseDTO);

      expect(domain).toBeInstanceOf(AccountDomain);
      expect(domain.getId()).toBe(VALID_UUID);
      expect(domain.getName()).toBe('Conta Principal');
      expect(domain.getBankName()).toBe('Nubank');
      expect(domain.getInitialBalance()).toBe(1000);
      expect(domain.getUser()).toBeNull();
    });

    it('deve aceitar bankName nulo', () => {
      const domain = AccountDomainAdapter.toDomain({
        ...baseDTO,
        bankName: null,
      });
      expect(domain.getBankName()).toBeNull();
    });
  });

  describe('toDTO()', () => {
    it('deve converter domínio para DTO', () => {
      const domain = AccountDomain.create(baseDTO);
      const dto = AccountDomainAdapter.toDTO(domain);

      expect(dto.id).toBe(VALID_UUID);
      expect(dto.name).toBe('Conta Principal');
      expect(dto.bankName).toBe('Nubank');
      expect(dto.initialBalance).toBe(1000);
      expect(dto.user).toBeNull();
      expect(dto.createdAt).toEqual(new Date('2024-01-01'));
    });
  });

  describe('round-trip', () => {
    it('deve preservar os valores em toDomain → toDTO', () => {
      const dto = AccountDomainAdapter.toDTO(
        AccountDomainAdapter.toDomain(baseDTO),
      );

      expect(dto.id).toBe(baseDTO.id);
      expect(dto.name).toBe(baseDTO.name);
      expect(dto.bankName).toBe(baseDTO.bankName);
      expect(dto.initialBalance).toBe(baseDTO.initialBalance);
    });
  });
});
