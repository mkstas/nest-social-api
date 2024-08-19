import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfilesService {
  /**
   * Inject dependencies
   */
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Create and return a new profile
   */
  async create(dto: CreateProfileDto) {
    return await this.prismaService.profile.create({
      data: {
        userId: dto.userId,
        userName: dto.userName,
      },
    });
  }

  /**
   * Find and return profile with user data
   */
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

  /**
   * Upload and return profile image url
   */
  async uploadImage(userId: number, imageUrl: string) {
    await this.prismaService.profile.update({
      where: { userId },
      data: { imageUrl },
    });

    return imageUrl;
  }
}
