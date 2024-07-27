import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfilesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreateProfileDto) {
    return await this.prismaService.profile.create({
      data: {
        userId: dto.userId,
        userName: dto.userName,
      },
    });
  }

  async findOne(userId: number) {
    return await this.prismaService.profile.findUnique({
      where: { userId },
      select: {
        userName: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    });
  }
}
