import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Set global module
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
