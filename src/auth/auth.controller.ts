import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';
import { Request, Response } from 'express';
import { COOKIE_DENIED, JWT_DENIED } from './const/auth.const';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const jwt = await this.authService.signUp(createUserDto);
    response.cookie('jwt', jwt, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
  }

  @Post('signin')
  async signin(
    @Body() data: AuthDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const jwt = await this.authService.signIn(data);

    response.cookie('jwt', jwt, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
  }

  @Get('logout')
  async logout(@Req() req: Request): Promise<void> {
    await this.authService.logout(req.user['sub']);
  }

  @Get('refresh')
  async refreshTokens(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    if (!request.cookies.jwt) {
      throw new ForbiddenException(COOKIE_DENIED);
    }
    const jwt = await this.authService.refreshTokens(
      request.cookies.jwt.id,
      request.cookies.jwt.tokens.refreshToken,
    );
    if (!jwt) {
      throw new ForbiddenException(JWT_DENIED);
    }
    response.cookie('jwt', jwt, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
  }
}
