import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Comment } from '@prisma/client';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { JwtRequest } from 'src/auth/auth.types';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req: JwtRequest, @Body() dto: CreateCommentDto): Promise<Comment> {
    const { sub } = this.jwtService.decode<{ sub: number }>(req.cookies.accessToken);
    const comment = await this.commentsService.create({ ...dto, userId: sub });
    return comment;
  }
}
