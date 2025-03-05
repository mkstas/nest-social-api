import { Body, Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  @Post('')
  @UseGuards(AccessTokenGuard)
  async create(@Body() dto: CreatePostDto) {}

  @Get('')
  async find() {}

  @Get(':id')
  async findOne() {}

  @Patch(':id')
  async update() {}

  @Delete(':id')
  async remove() {}
}
