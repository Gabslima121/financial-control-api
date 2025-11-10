export class InvalidCNPJError extends Error {
  constructor(message?: string) {
    super(message || 'CNPJ inválido');
    this.name = 'InvalidCNPJError';
  }
}
