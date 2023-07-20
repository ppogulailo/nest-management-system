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
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const jwt = await this.authService.signUp(createUserDto);
    response.cookie('jwt', jwt, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return { jwt: jwt.tokens.accessToken, id: jwt.id };
  }

  @Post('signin')
  async signin(
    @Body() data: AuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const jwt = await this.authService.signIn(data);

    response.cookie('jwt', jwt, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return { jwt: jwt.tokens.accessToken, id: jwt.id };
  }

  @Get('logout')
  async logout(@Req() req: Request) {
    await this.authService.logout(req.user['sub']);
  }

  @Get('refresh')
  async refreshTokens(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!request.cookies.jwt) {
      throw new ForbiddenException('Cookie Denied');
    }
    const jwt = await this.authService.refreshTokens(
      request.cookies.jwt.id,
      request.cookies.jwt.tokens.refreshToken,
    );
    if (!jwt) {
      throw new ForbiddenException('Jwt Denied');
    }
    response.cookie('jwt', jwt, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return jwt.tokens.accessToken;
  }
}
