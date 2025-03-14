import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Article, Like } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { LikesService } from 'src/core/likes/likes.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly likesService: LikesService,
  ) {}

  async create(userId: number, dto: CreateArticleDto): Promise<Article> {
    const article = await this.prismaService.article.create({
      data: { userId, ...dto },
    });
    return article;
  }

  async findAll(): Promise<Article[]> {
    const articles = await this.prismaService.article.findMany({
      where: { isHidden: false },
      include: {
        user: {
          select: {
            userId: true,
            userName: true,
          },
        },
        like: true,
        comment: {
          include: {
            user: {
              select: {
                userId: true,
                userName: true,
              },
            },
          },
        },
      },
    });
    return articles;
  }

  async findOne(articleId: number): Promise<Article> {
    const article = await this.prismaService.article.findUnique({
      where: { articleId, isHidden: false },
    });
    if (!article) throw new NotFoundException('Article is not found');
    return article;
  }

  async update(
    userId: number,
    articleId: number,
    dto: Partial<UpdateArticleDto>,
  ): Promise<Article> {
    const article = await this.findOne(articleId);
    if (userId !== article.userId) throw new UnauthorizedException('Access is denied');
    const updatedArticle = await this.prismaService.article.update({
      where: { articleId },
      data: { ...dto },
    });
    return updatedArticle;
  }

  async remove(userId: number, articleId: number): Promise<Article> {
    const article = this.update(userId, articleId, { isHidden: true });
    return article;
  }

  async likeArticle(userId: number, articleId: number): Promise<Like> {
    let like = await this.likesService.findOne({ userId, articleId });
    if (!like) {
      like = await this.likesService.create({ userId, articleId });
    } else {
      await this.likesService.remove(userId, articleId);
    }
    return like;
  }
}
