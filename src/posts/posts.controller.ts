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
import { Like, Post as PostType } from '@prisma/client';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { JwtRequest } from 'src/auth/auth.types';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req: JwtRequest, @Body() dto: CreatePostDto): Promise<PostType> {
    const { sub } = this.jwtService.decode<{ sub: number }>(req.cookies.accessToken);
    const post = await this.postsService.create(dto, sub);
    return post;
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<PostType[]> {
    const posts = await this.postsService.findAll();
    return posts;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) postId: number): Promise<PostType> {
    const post = await this.postsService.findOne(postId);
    return post;
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) postId: number,
    @Req() req: JwtRequest,
    @Body() dto: UpdatePostDto,
  ): Promise<PostType> {
    const { sub } = this.jwtService.decode<{ sub: number }>(req.cookies.accessToken);
    const post = await this.postsService.update(postId, sub, dto);
    return post;
  }

  @Get('like/:id')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async like(@Param('id', ParseIntPipe) postId: number, @Req() req: JwtRequest): Promise<Like> {
    const { sub } = this.jwtService.decode<{ sub: number }>(req.cookies.accessToken);
    const like = await this.postsService.like({ postId, userId: sub });
    return like;
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async hide(@Param('id', ParseIntPipe) postId: number, @Req() req: JwtRequest): Promise<boolean> {
    const { sub } = this.jwtService.decode<{ sub: number }>(req.cookies.accessToken);
    await this.postsService.hide(postId, sub);
    return true;
  }
}
