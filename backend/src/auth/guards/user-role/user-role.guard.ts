import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';
// import { Role } from 'src/auth/entities/role.entity';
import { User } from 'src/auth/entities/user.entity';
import { ValidRoles } from 'src/auth/interfaces/valid_roles';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: ValidRoles[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );
    if (!validRoles) return true;
    if (validRoles.length === 0) return true;
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;
    if (!user) throw new InternalServerErrorException('User not found');
    if (user.firstTime)
      throw new ForbiddenException('Password change required');
    for (const role of user.roles) {
      if (validRoles.includes(role.name as ValidRoles)) {
        return true;
      }
    }
    throw new ForbiddenException(
      `User ${user.email} need a valid role: [ ${validRoles} ]`,
    );
  }
}
