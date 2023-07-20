import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, UserRole } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { USER_EXIST, USER_NOT_FOUND } from './const/user.const';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(userDto: CreateUserDto): Promise<User> {
    const existUser = await this.findByEmail(userDto.email);
    console.log(existUser);
    if (existUser) {
      throw new NotFoundException(USER_EXIST);
    }
    const user = await this.prismaService.user.create({
      data: {
        ...userDto,
        role: 'User',
      },
    });
    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    return user;
  }

  async changeBoss(id: string, bossId: string, user: User) {
    const existUser = await this.findById(id);
    if (!existUser) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    console.log(user);
    const newBoss = await this.prismaService.user.findFirst({
      where: {
        id: bossId,
        role: 'Boss',
      },
    });
    if (!newBoss) {
      throw new NotFoundException('User doesnt exist or not a boss!');
    }
  }

  async updateRole(id: string, role: UserRole): Promise<User> {
    const existUser = await this.findById(id);
    if (!existUser) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    const user = await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        role,
      },
    });
    return user;
  }
}
