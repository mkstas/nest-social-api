import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [JwtModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
