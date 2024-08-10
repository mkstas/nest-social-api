import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  /**
   * Inject dependencies
   */
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Create and return a new user
   */
  async create(dto: CreateUserDto) {
    /**
     * Hash password
     */
    const passwordHash = await bcrypt.hash(dto.password, 10);

    return await this.prismaService.user.create({
      data: {
        email: dto.email,
        passwordHash,
      },
    });
  }

  /**
   * Find and return user by email
   */
  async findOne(email: string) {
    return await this.prismaService.user.findUnique({
      where: { email },
    });
  }
}
