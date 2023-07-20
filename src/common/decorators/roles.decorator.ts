import { SetMetadata } from '@nestjs/common';

export const HasRoles = (...hasRoles: string[]) =>
  SetMetadata('roles', hasRoles);
