import { UserDomain } from '../domain/users/users.domain';

export interface UserPort {
  createUser(user: UserDomain): Promise<UserDomain>;
  listUserByEmail(email: string): Promise<UserDomain | null>;
  listAllUsers(): Promise<UserDomain[]>;
  encryptPassword(password: string): Promise<string>;
  decryptPassword(password: string, hash: string): Promise<boolean>;
}
