import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from '../../user/user.service';
import { USER_NOT_AUTHORIZE } from "../../user/const/user.const";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const decodedToken = await this.authService.verifyUser(
        req.cookies.jwt.tokens.accessToken,
      );
      // make sure that the user is not deleted, or that props or rights changed compared to the time when the jwt was issued
      const user = await this.userService.findByEmail(decodedToken.email);
      if (user) {
        // add the user to our req object, so that we can access it later when we need it
        // if it would be here, we would like overwrite
        req.user = user;
        next();
      } else {
        throw new UnauthorizedException(USER_NOT_AUTHORIZE);
      }
    } catch (e) {
      throw new UnauthorizedException(USER_NOT_AUTHORIZE);
    }
  }
}
