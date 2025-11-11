import { randomUUID } from 'crypto';
import { ValueObject } from '../domain/value-object';

export class UuidValueObject extends ValueObject {
  private readonly id: string;

  constructor(id?: string) {
    super();
    this.id = id && id.trim() !== '' ? id : randomUUID();
    this.validate();
  }

  private validate(): void {
    if (!UuidValueObject.isValidUuid(this.id)) {
      throw new Error(`Invalid UUID: ${this.id}`);
    }
  }

  private static isValidUuid(value: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }

  public toString(): string {
    return this.id;
  }

  public getId(): string {
    return this.id;
  }

  public getValue(): string {
    return this.id;
  }
}
