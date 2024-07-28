import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/core/users/users.module';
import { ProfilesModule } from 'src/core/profiles/profiles.module';
import { TokensModule } from 'src/core/tokens/tokens.module';
import { AccessTokenStrategy } from 'src/strategies/access-token.strategy';
import { RefreshTokenStrategy } from 'src/strategies/refresh-token.strategy';

@Module({
  imports: [JwtModule, UsersModule, ProfilesModule, TokensModule],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
