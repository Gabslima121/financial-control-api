import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { compareSync, hashSync } from 'bcrypt';
import { UserDomain } from "src/core/domain/user/user.domain";
import { UserPort } from "src/core/port/user.port";
import { UserDomainAdapter } from "../in/user.adapter";

@Injectable()
export class UserRepository implements UserPort {
    constructor(
        private readonly prisma: PrismaClient,
    ) {}

    async decryptPassword(password: string, hash: string): Promise<boolean> {
        return compareSync(password, hash);
    }

    async encryptPassword(password: string): Promise<string> {
        return hashSync(password, 10);
    }

    async listAllUsers(): Promise<UserDomain[]> {
        const users = await this.prisma.user.findMany();

        return users.map(UserDomainAdapter.toDomain);
    }

    async findUserByEmail(email: string): Promise<UserDomain | null> {
        const userExists = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!userExists) {
            return null;
        }

        const userDomain = UserDomainAdapter.toDomain({
            userId: userExists.userId,
            userName: userExists.userName,
            userDocument: userExists.userDocument,
            email: userExists.email,
            createdAt: userExists.createdAt,
            updatedAt: userExists.updatedAt,
            isActive: userExists.isActive,
            password: userExists.password,
        })

        return userDomain;
    }

    async createUser(user: UserDomain): Promise<void> {
        await this.prisma.user.create({
            data: {
                userId: user.getUserId(),
                userName: user.getUserName(),
                userDocument: user.getUserDocument(),
                email: user.getEmail(),
                password: user.getPassword(),
                isActive: user.getIsActive(),
                createdAt: user.getCreatedAt()!,
                updatedAt: user.getUpdatedAt()!,
            }
        })
    }
}