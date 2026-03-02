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

    async findById(userId: string): Promise<UserDomain | null> {
        const userExists = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!userExists) {
            return null;
        }

        return UserDomainAdapter.toDomain({
            id: userExists.id,
            name: userExists.name,
            document: userExists.document,
            email: userExists.email,
            createdAt: userExists.createdAt,
            updatedAt: userExists.updatedAt,
            isActive: userExists.isActive,
            password: userExists.password,
        })
    }

    async decryptPassword(password: string, hash: string): Promise<boolean> {
        return compareSync(password, hash);
    }

    async encryptPassword(password: string): Promise<string> {
        return hashSync(password, 10);
    }

    async listAllUsers(): Promise<UserDomain[]> {
        const users = await this.prisma.user.findMany();

        return users.map((user) => UserDomainAdapter.toDomain({
            id: user.id,
            name: user.name,
            document: user.document,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            isActive: user.isActive,
            password: user.password
        }));
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
            id: userExists.id,
            name: userExists.name,
            document: userExists.document,
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
                id: user.getId(),
                name: user.getName(),
                document: user.getDocument(),
                email: user.getEmail(),
                password: user.getPassword(),
                isActive: user.getIsActive(),
                createdAt: user.getCreatedAt()!,
                updatedAt: user.getUpdatedAt()!,
            }
        })
    }
}