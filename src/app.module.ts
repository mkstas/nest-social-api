import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './core/users/users.module';
import { ProfilesModule } from './core/profiles/profiles.module';
import { TokensModule } from './core/tokens/tokens.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, UsersModule, ProfilesModule, TokensModule, AuthModule],
})
export class AppModule {}
