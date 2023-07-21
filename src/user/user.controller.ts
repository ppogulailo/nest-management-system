import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserService } from './user.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { HasRoles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '@prisma/client';
import { User } from '../common/decorators/user.decorator';
import { IdValidationPipe } from '../common/pipes/id-validation.pipe';
import { BossIdValidationPipe } from "../common/pipes/boss-validation.pipe";

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @ApiCookieAuth()
  @ApiOperation({ summary: 'GET - FIND USERS' })
  @ApiResponse({ status: 200 })
  @Get()
  async find(@User() user) {
    return this.userService.find(user);
  }
  @ApiCookieAuth()
  @ApiOperation({ summary: 'PUT - CHANGE_BOSS' })
  @ApiResponse({ status: 200 })
  @HasRoles(UserRole.Boss)
  @UseGuards(RolesGuard)
  @Put('change-boss/:id')
  async changeBoss(
    @Param('id', IdValidationPipe) id: string,
    @User() user,
    @Query('bossId', BossIdValidationPipe) bossId: string,
  ) {
    return this.userService.changeBoss(id, bossId, user);
  }
}
