import { UseRegisterDTO } from "../dtos";
import { prisma } from "../prisma/client";

class UserRepository {
    async createUser(data: UseRegisterDTO) {
        return prisma.user.create({
            data:
            {
                name: data.name,
                email: data.email,
                password: data.password,
            },
        })
    }

    async findByEmail(email: string) {
        return prisma.user.findUnique({ where: { email } });
    }

    async findById(userid: string) {
        return prisma.user.findUnique({ where: { id: userid } });
    }

    async findProxyUserByUserId(userId: string) {
        return prisma.proxyUser.findFirst({
            where: { userId },
        });
    }

    async createUserProxy(data: {
        userId: string;
        username: string;
        password: string;
        subuserId: string;
    }) {
        return prisma.proxyUser.create({
            data: {
                ...data,
            },
        });
    }


}

export default UserRepository;