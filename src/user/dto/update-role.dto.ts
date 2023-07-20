import { IsEnum } from 'class-validator';
import { UserRole } from '@prisma/client';

export class UpdateRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}
