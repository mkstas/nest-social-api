import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Article, Like } from '@prisma/client';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { JwtPayload, JwtRequest } from 'src/types/jwt.types';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { CreateArticleLikeDto } from './dto/create-article-like.dto';

@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly articlesService: ArticlesService,
  ) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req: JwtRequest, @Body() dto: CreateArticleDto): Promise<Article> {
    const { sub } = this.jwtService.decode<JwtPayload>(req.cookies.accessToken);
    const article = await this.articlesService.create(sub, dto);
    return article;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Article[]> {
    const articles = await this.articlesService.findAll();
    return articles;
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) articleId: number,
    @Req() req: JwtRequest,
    @Body() dto: UpdateArticleDto,
  ): Promise<Article> {
    const { sub } = this.jwtService.decode<JwtPayload>(req.cookies.accessToken);
    const article = this.articlesService.update(sub, articleId, dto);
    return article;
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id', ParseIntPipe) articleId: number,
    @Req() req: JwtRequest,
  ): Promise<Article> {
    const { sub } = this.jwtService.decode<JwtPayload>(req.cookies.accessToken);
    const article = this.articlesService.remove(sub, articleId);
    return article;
  }

  @Post('like')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async likeArticle(@Body() dto: CreateArticleLikeDto, @Req() req: JwtRequest): Promise<Like> {
    const { sub } = this.jwtService.decode<JwtPayload>(req.cookies.accessToken);
    const like = await this.articlesService.likeArticle(sub, dto.articleId);
    return like;
  }
}
