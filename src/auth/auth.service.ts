import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { USER_EXIST, USER_NOT_FOUND } from '../user/const/user.const';
import { AuthDto } from './dto/auth.dto';
import { ACCESS_DENIED, USER_WRONG_PASSWORD } from './const/auth.const';
import { User } from '@prisma/client';
import { ITokens } from '../common/types/tokens';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<ITokens> {
    // Check if user exists
    const userExists = await this.userService.findByEmail(createUserDto.email);
    if (userExists) {
      throw new BadRequestException(USER_EXIST);
    }

    // Hash password
    const hash = await this.hashData(createUserDto.password);
    const newUser = await this.userService.create({
      ...createUserDto,
      password: hash,
    });

    const tokens = await this.getTokens(
      newUser.id,
      newUser.email,
      newUser.name,
    );

    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return tokens;
  }

  async signIn(data: AuthDto): Promise<ITokens> {
    // Check if user exists
    const user = await this.userService.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND);
    }
    const passwordMatches = await argon2.verify(user.password, data.password);

    if (!passwordMatches) {
      throw new UnauthorizedException(USER_WRONG_PASSWORD);
    }
    const tokens = await this.getTokens(user.id, user.email, user.name);

    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string): Promise<User> {
    return this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: null,
      },
    });
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<ITokens> {
    const user = await this.userService.findById(userId);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException(ACCESS_DENIED);
    }
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new ForbiddenException(ACCESS_DENIED);
    }
    const tokens = await this.getTokens(user.id, user.email, user.name);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async hashData(data: string) {
    return argon2.hash(data);
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: hashedRefreshToken,
      },
    });
  }

  async verifyUser(authToken) {
    const verify = await this.jwtService.verifyAsync(authToken, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });
    return verify;
  }

  async getTokens(
    userId: string,
    email: string,
    name: string,
  ): Promise<ITokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          name,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '3d',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          name,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '30d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
