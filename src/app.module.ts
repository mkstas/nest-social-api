import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './core/users/users.module';
import { ProfilesModule } from './core/profiles/profiles.module';
import { TokensModule } from './core/tokens/tokens.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './core/posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    UsersModule,
    ProfilesModule,
    TokensModule,
    AuthModule,
    PostsModule,
  ],
})
export class AppModule {}
