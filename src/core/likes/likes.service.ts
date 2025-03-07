import { Injectable } from '@nestjs/common';
import { Like } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLikeDto } from './dto/create-like.dto';

@Injectable()
export class LikesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreateLikeDto): Promise<Like> {
    const like = await this.prismaService.like.create({
      data: dto,
    });
    return like;
  }

  async findOne(dto: CreateLikeDto) {
    const like = await this.prismaService.like.findFirst({
      where: dto,
    });
    return like;
  }

  async remove(articleId: number): Promise<void> {
    await this.prismaService.like.deleteMany({
      where: { articleId },
    });
  }
}
