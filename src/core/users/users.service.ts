import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreateUserDto): Promise<Partial<User>> {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const { email, userName, userId } = await this.prismaService.user.create({
      data: {
        email: dto.email,
        userName: dto.userName,
        passwordHash,
      },
    });
    return { email, userName, userId };
  }

  async findOne(email: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    return user;
  }
}
