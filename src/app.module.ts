import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './core/users/users.module';
import { TokensModule } from './core/tokens/tokens.module';
import { ArticlesModule } from './core/articles/articles.module';
import { CommentsModule } from './core/comments/comments.module';
import { LikesModule } from './core/likes/likes.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    TokensModule,
    ArticlesModule,
    CommentsModule,
    LikesModule,
  ],
})
export class AppModule {}
