import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Comment } from '@prisma/client';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { JwtPayload, JwtRequest } from 'src/types/jwt.types';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

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
    const { sub: userId } = this.jwtService.decode<JwtPayload>(req.cookies.accessToken);
    const comment = await this.commentsService.create(userId, dto);
    return comment;
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) commentId: number) {
    const comment = await this.commentsService.remove(commentId);
    return comment;
  }
}
