import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  /**
   * Connect database
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Disconnect database
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
