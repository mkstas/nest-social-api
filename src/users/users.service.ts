import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreateUserDto): Promise<Partial<User>> {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const { email, userName, userId } = await this.prismaService.user.create({
      data: {
        email: dto.email,
        passwordHash,
        userName: dto.userName,
      },
    });
    return { email, userName, userId };
  }
}
