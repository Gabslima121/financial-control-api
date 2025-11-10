import { InvalidCNPJError } from '../../errors/cnpj-errors';
import { CnpjValueObject } from '../cnpj.vo';

describe('CnpjValueObject Value Object', () => {
  describe('constructor', () => {
    it('deve criar um CnpjValueObject válido sem separadores', () => {
      const cnpj = new CnpjValueObject('12345678000195');
      expect(cnpj.getValue()).toBe('12345678000195');
    });

    it('deve criar um CnpjValueObject válido com separadores', () => {
      const cnpj = new CnpjValueObject('12.345.678/0001-95');
      expect(cnpj.getValue()).toBe('12345678000195');
    });

    it('deve lançar erro para CnpjValueObject inválido', () => {
      expect(() => new CnpjValueObject('12345678000100')).toThrow(
        InvalidCNPJError,
      );
      expect(() => new CnpjValueObject('11111111111111')).toThrow(
        InvalidCNPJError,
      );
      expect(() => new CnpjValueObject('')).toThrow(InvalidCNPJError);
      expect(() => new CnpjValueObject('123')).toThrow(InvalidCNPJError);
      expect(() => new CnpjValueObject('invalid_cnpj')).toThrow(
        InvalidCNPJError,
      );
    });
  });

  describe('getValue', () => {
    it('deve retornar o CnpjValueObject sem formatação', () => {
      const cnpj = new CnpjValueObject('12.345.678/0001-95');
      expect(cnpj.getValue()).toBe('12345678000195');
    });
  });

  describe('getFormattedValue', () => {
    it('deve retornar o CnpjValueObject formatado corretamente', () => {
      const cnpj = new CnpjValueObject('12345678000195');
      expect(cnpj.getFormattedValue()).toBe('12.345.678/0001-95');
    });

    it('deve retornar o CnpjValueObject formatado a partir de entrada com separadores', () => {
      const cnpj = new CnpjValueObject('12.345.678/0001-95');
      expect(cnpj.getFormattedValue()).toBe('12.345.678/0001-95');
    });
  });

  describe('validação', () => {
    it('deve validar CNPJs válidos', () => {
      const validCNPJs = ['12345678000195', '12.345.678/0001-95'];
      validCNPJs.forEach((cnpj) => {
        expect(() => new CnpjValueObject(cnpj)).not.toThrow();
      });
    });

    it('deve rejeitar CNPJs com dígitos repetidos', () => {
      const invalidCNPJs = [
        '00000000000000',
        '11111111111111',
        '22222222222222',
      ];
      invalidCNPJs.forEach((cnpj) => {
        expect(() => new CnpjValueObject(cnpj)).toThrow(InvalidCNPJError);
      });
    });

    it('deve rejeitar CNPJs com menos de 14 dígitos', () => {
      expect(() => new CnpjValueObject('123')).toThrow(InvalidCNPJError);
    });

    it('deve rejeitar CNPJs com caracteres inválidos', () => {
      expect(() => new CnpjValueObject('12.345.678/000A-95')).toThrow(
        InvalidCNPJError,
      );
    });
  });
});
