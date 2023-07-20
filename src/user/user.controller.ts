import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UsersService) {}
}
