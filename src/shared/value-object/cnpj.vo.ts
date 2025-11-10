import { ValueObject } from '../domain/value-object';
import { InvalidCNPJError } from '../errors/cnpj-errors';

export class CnpjValueObject extends ValueObject {
  private readonly cnpj: string;

  constructor(cnpj: string) {
    super();
    const normalizedCnpj = CnpjValueObject.normalize(cnpj);

    if (!CnpjValueObject.isValid(normalizedCnpj)) {
      throw new InvalidCNPJError('CNPJ inválido');
    }

    this.cnpj = normalizedCnpj;
  }

  public getValue(): string {
    return this.cnpj;
  }

  public getFormattedValue(): string {
    return this.cnpj.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5',
    );
  }

  // Valida se o CnpjValueObject é válido
  static isValid(cnpj: string): boolean {
    if (!cnpj || cnpj.length !== 14 || /^[0-9]{14}$/.test(cnpj) === false) {
      return false;
    }

    // CNPJs com números repetidos são inválidos
    const invalids = [
      '00000000000000',
      '11111111111111',
      '22222222222222',
      '33333333333333',
      '44444444444444',
      '55555555555555',
      '66666666666666',
      '77777777777777',
      '88888888888888',
      '99999999999999',
    ];
    if (invalids.includes(cnpj)) {
      return false;
    }

    // Validação dos dígitos verificadores
    const calcDigit = (base: string): number => {
      const weights =
        base.length === 12
          ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
          : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

      const sum = base.split('').reduce((acc, curr, index) => {
        return acc + parseInt(curr, 10) * weights[index];
      }, 0);

      const remainder = sum % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    const base = cnpj.substring(0, 12);
    const firstDigit = calcDigit(base);
    const secondDigit = calcDigit(base + firstDigit);

    return cnpj === base + firstDigit + secondDigit;
  }

  // Normaliza o CnpjValueObject, removendo separadores
  private static normalize(cnpj: string): string {
    return cnpj.replace(/\D/g, '');
  }
}
