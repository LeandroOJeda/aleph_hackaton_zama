import {
  createParamDecorator,
  InternalServerErrorException,
} from '@nestjs/common';

// This decorator is used to get the user from the request
export const GetUser = createParamDecorator((data: string, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;
  if (!user) throw new InternalServerErrorException('User not found');
  return !data ? user : user[data];
});
