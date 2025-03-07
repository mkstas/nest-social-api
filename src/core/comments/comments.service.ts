import { Injectable } from '@nestjs/common';
import { Comment } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prismaServie: PrismaService) {}

  async create(userId: number, dto: CreateCommentDto): Promise<Comment> {
    const comment = await this.prismaServie.comment.create({
      data: { userId, ...dto },
    });
    return comment;
  }

  async remove(commentId: number): Promise<Comment> {
    const comment = await this.prismaServie.comment.update({
      where: { commentId },
      data: { isHidden: true },
    });
    return comment;
  }
}
