import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);

    return await this.prismaService.user.create({
      data: {
        email: dto.email,
        passwordHash,
      },
    });
  }
}
