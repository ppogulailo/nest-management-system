import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@prisma/client';
import { UserService } from '../../user/user.service';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly usersService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request: Request = context.switchToHttp().getRequest();
    const user: User = request.user;
    const hasRole = () => roles.indexOf(user.role) > -1;
    let hasPermission = false;
    if (hasRole()) {
      hasPermission = true;
    }
    return user && hasPermission;
  }
}
