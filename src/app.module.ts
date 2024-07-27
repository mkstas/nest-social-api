import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { TokensModule } from './tokens/tokens.module';

@Module({
  imports: [PrismaModule, UsersModule, ProfilesModule, TokensModule],
})
export class AppModule {}
