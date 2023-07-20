import { Body, Controller, Param, Patch, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateRoleDto } from './dto/update-role.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Put(':id')
  async updateRole(@Param('id') id: string, @Body() { role }: UpdateRoleDto) {
    return this.userService.updateRole(id, role);
  }
}
