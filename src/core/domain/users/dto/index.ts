export interface UserDomainDTO {
  userId?: string;
  userName: string;
  userDocument: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
  isActive: boolean;
}
