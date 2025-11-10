import { ValueObject } from '../domain/value-object';

export class CpfValueObject extends ValueObject {
  private readonly cpf: string;

  constructor(cpf: string) {
    super();
    if (!CpfValueObject.isValidCPF(cpf)) {
      throw new Error('CPF inválido');
    }

    this.cpf = CpfValueObject.cleanCPF(cpf);
  }

  private static cleanCPF(cpf: string): string {
    return cpf.replace(/[^\d]/g, '');
  }

  private static isValidCPF(cpf: string): boolean {
    const cleanedCPF = CpfValueObject.cleanCPF(cpf);
    let sum = 0;

    if (cleanedCPF.length !== 11 || /^(\d)\1{10}$/.test(cleanedCPF)) {
      return false;
    }

    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanedCPF.charAt(i)) * (10 - i);
    }

    let firstVerifier = 11 - (sum % 11);
    if (firstVerifier >= 10) firstVerifier = 0;

    if (firstVerifier !== parseInt(cleanedCPF.charAt(9))) {
      return false;
    }

    sum = 0;

    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanedCPF.charAt(i)) * (11 - i);
    }

    let secondVerifier = 11 - (sum % 11);
    if (secondVerifier >= 10) secondVerifier = 0;

    if (secondVerifier !== parseInt(cleanedCPF.charAt(10))) {
      return false;
    }

    return true;
  }

  public static generate(): string {
    const cpfBase = Array.from({ length: 9 }, () =>
      Math.floor(Math.random() * 10),
    );

    const firstCheckDigit = CpfValueObject.calculateCheckDigit(cpfBase, 10);

    const secondCheckDigit = CpfValueObject.calculateCheckDigit(
      [...cpfBase, firstCheckDigit],
      11,
    );

    const fullCpf = [...cpfBase, firstCheckDigit, secondCheckDigit].join('');

    return CpfValueObject.formatCPF(fullCpf);
  }

  private static calculateCheckDigit(
    digits: number[],
    multiplierStart: number,
  ): number {
    const sum = digits.reduce(
      (acc, digit, index) => acc + digit * (multiplierStart - index),
      0,
    );

    const remainder = sum % 11;

    return remainder < 2 ? 0 : 11 - remainder;
  }

  public static formatCPF(cpf: string): string {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  public getValue(): string {
    return this.cpf;
  }
}
