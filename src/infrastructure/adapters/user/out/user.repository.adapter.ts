import { PrismaClient } from '@prisma/client';
import { compareSync, hashSync } from 'bcrypt';
import { UserDomain } from '../../../../core/domain/users/users.domain';
import { UserPort } from '../../../../core/port/user.port';
import { UserDomainAdapter } from '../in/user.domain.adapter';

export class PrismaUserRepository implements UserPort {
  constructor(private readonly prisma: PrismaClient) {}

  async decryptPassword(password: string, hash: string): Promise<boolean> {
    return compareSync(password, hash);
  }

  async encryptPassword(password: string): Promise<string> {
    return hashSync(password, 10);
  }

  async createUser(user: UserDomain): Promise<UserDomain> {
    const data = UserDomainAdapter.toDTO(user);

    const createdUser = await this.prisma.user.create({
      data,
    });

    return UserDomainAdapter.toDomain(createdUser);
  }

  async listUserByEmail(email: string): Promise<UserDomain | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user ? UserDomainAdapter.toDomain(user) : null;
  }

  async listAllUsers(): Promise<UserDomain[]> {
    const users = await this.prisma.user.findMany();

    return users.map(UserDomainAdapter.toDomain);
  }
}
