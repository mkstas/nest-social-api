import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';

@Module({
  providers: [ProfilesService],
  exports: [ProfilesService],
  controllers: [ProfilesController],
})
export class ProfilesModule {}
