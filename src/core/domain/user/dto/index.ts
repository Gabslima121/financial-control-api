export interface UserDomainDTO {
  id?: string;
  name: string;
  document: string;
  email: string;
  password: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  isActive: boolean;
}
