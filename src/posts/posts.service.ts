import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from '@prisma/client';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreatePostDto, userId: number): Promise<Post> {
    const post = await this.prismaService.post.create({
      data: { userId, content: dto.content },
    });
    return post;
  }

  async findAll(): Promise<Post[]> {
    const posts = await this.prismaService.post.findMany();
    return posts;
  }

  async findOne(postId: number): Promise<Post> {
    const post = await this.prismaService.post.findUnique({
      where: { postId },
    });
    if (!post) throw new NotFoundException('Post is not found');
    return post;
  }

  async update(postId: number, userId: number, dto: Partial<UpdatePostDto>): Promise<Post> {
    const post = await this.findOne(postId);
    if (userId !== post.postId) throw new UnauthorizedException('Access is denied');
    const updatedPost = await this.prismaService.post.update({
      where: { postId },
      data: { ...dto },
    });
    return updatedPost;
  }

  async hide(postId: number, userId: number): Promise<boolean> {
    await this.update(postId, userId, { isHidden: false });
    return true;
  }
}
