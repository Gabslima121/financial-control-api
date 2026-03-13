import { UserDomain } from '../domain/user/user.domain';

export interface UserPort {
  createUser(user: UserDomain): Promise<void>;
  findUserByEmail(email: string): Promise<UserDomain | null>;
  listAllUsers(): Promise<UserDomain[]>;
  encryptPassword(password: string): Promise<string>;
  decryptPassword(password: string, hash: string): Promise<boolean>;
  findById(userId: string): Promise<UserDomain | null>;
}
