import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly postsService: PostsService,
  ) {}

  @Get()
  async findOne() {}

  @Get()
  async findAll() {}

  @Post()
  async create() {}

  @Patch()
  async update() {}

  @Delete()
  async delete() {}
}
