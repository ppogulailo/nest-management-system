import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  async create(userDto): Promise<User> {
    const existUser = this.findByEmail(userDto.email);
    if (existUser) {
      throw new NotFoundException('User is already exist!');
    }
    const user = this.prismaService.user.create({
      data: userDto,
    });
    return user;
  }
  async findById(id: string): Promise<User> {
    const user = this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    return user;
  }
  async findByEmail(email: string): Promise<User> {
    const user = this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    return user;
  }
}
