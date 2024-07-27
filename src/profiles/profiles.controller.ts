import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.profilesService.findOne(id);
  }
}
