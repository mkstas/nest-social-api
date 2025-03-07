import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { LikesModule } from 'src/core/likes/likes.module';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';

@Module({
  imports: [JwtModule, LikesModule],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
