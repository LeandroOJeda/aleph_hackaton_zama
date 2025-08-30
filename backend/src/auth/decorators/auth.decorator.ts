import { applyDecorators, UseGuards } from '@nestjs/common';
import { ValidRoles } from '../interfaces/valid_roles';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';
import { RoleProtected } from './role-protected.decorator';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    UseGuards(AuthGuard(), UserRoleGuard),
    RoleProtected(...roles),
  );
}
