import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { HasRoles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '@prisma/client';
import { User } from '../common/decorators/user.decorator';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  async find(@User() user) {
    return this.userService.find(user);
  }
  @Put(':id')
  async updateRole(@Param('id') id: string, @Body() { role }: UpdateRoleDto) {
    return this.userService.updateRole(id, role);
  }

  @HasRoles(UserRole.Boss)
  @UseGuards(RolesGuard)
  @Put('change-boss/:id')
  async changeBoss(
    @Param('id') id: string,
    @User() user,
    @Query('bossId') bossId: string,
  ) {
    return this.userService.changeBoss(id, bossId, user);
  }
}
