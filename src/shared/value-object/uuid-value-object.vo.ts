import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { ValueObject } from '../domain/value-object';

export class UuidValueObject extends ValueObject {
  private readonly id: string;

  constructor(id?: string) {
    super();
    this.id = id && id.trim() !== '' ? id : uuidv4();
    this.validate();
  }

  private validate(): void {
    if (!uuidValidate(this.id)) {
      throw new Error(`Invalid UUID: ${this.id}`);
    }
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
