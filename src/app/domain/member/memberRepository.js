import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class MemberRepository {
  async findById(id) {
    const user = await prisma.members.findUnique({
      where: { id: BigInt(id) },
      select: {
        id: true,
        userName: true,
        userType: true,
        kakaoId: true,
        email: true,
      },
    });

    if (user) {
      return {
        ...user,
        id: Number(user.id),
      };
    }
    return null;
  }

  async create(data) {
    return prisma.members.create({
      data: {
        kakaoId: data.kakaoId,
        email: data.email || null,
        userName: data.userName,
        userType: data.userType,
      },
      select: {
        id: true,
        userName: true,
        userType: true,
        kakaoId: true,
        email: true,
      },
    });
  }

  async findByKakaoId(kakaoId) {
    return prisma.members.findFirst({
      where: { kakaoId },
      select: {
        id: true,
        userName: true,
        userType: true,
        kakaoId: true,
        email: true,
      },
    });
  }

  async createProtect(data) {
    return prisma.protect.create({
      data: {
        guardianId: BigInt(data.guardianId),
        elderlyId: BigInt(data.elderlyId),
        status: data.status,
        requestType: data.requestType,
        verificationCode: data.verificationCode,
        codeExpiredAt: data.codeExpiredAt,
      },
    });
  }

  async findProtectById(id) {
    return prisma.protect.findUnique({
      where: { id: BigInt(id) },
    });
  }

  async updateProtect(id, data) {
    return prisma.protect.update({
      where: { id: BigInt(id) },
      data,
    });
  }

  async deleteById(id) {
    return prisma.members.delete({
      where: { id: BigInt(id) },
    });
  }
}
