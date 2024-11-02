import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class MemberRepository {
  async findById(id) {
    return prisma.members.findUnique({
      where: { id: BigInt(id) },
      select: {
        id: true,
        userId: true,
        userName: true,
        userType: true,
        password: true,
      },
    });
  }

  async findByUserId(userId) {
    return prisma.members.findUnique({
      where: { userId },
    });
  }

  async create(data) {
    return prisma.members.create({
      data,
      select: {
        id: true,
        userId: true,
        userName: true,
        userType: true,
      },
    });
  }

  async update(id, data) {
    return prisma.members.update({
      where: { id: BigInt(id) },
      data,
      select: {
        id: true,
        userId: true,
        userName: true,
        phoneNumber: true,
        birthday: true,
        userType: true,
      },
    });
  }

  async delete(id) {
    return prisma.members.delete({
      where: { id },
    });
  }
}
