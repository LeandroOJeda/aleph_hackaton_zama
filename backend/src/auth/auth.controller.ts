import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RefreshAuthGuard } from './guards/refresh-jwt/refresh-auth.guard';
import { ValidRoles } from './interfaces/valid_roles';
import { Auth } from './decorators/auth.decorator';
import { ChangeDefaultPasswordDto } from './dto/change_default_password_dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @Post('refresh-token')
  @UseGuards(RefreshAuthGuard)
  refreshToken(@GetUser() user: User) {
    return this.authService.refreshToken(user);
  }

  @Post('change_default_password')
  @UseGuards(AuthGuard('jwt'))
  changeDefaultPassword(
    @Body() changeDefaultPasswordDto: ChangeDefaultPasswordDto,
  ) {
    return this.authService.changeDefaultPassword(changeDefaultPasswordDto);
  }

  // Este es un ejemplo de endpoint protegido
  @Get('prueba')
  // @Auth es un decorador personalizado para protejer rutas por rol de Usuario.
  // Este decorador recibe un array de roles permitidos segun los detallados en ValidRoles.
  @Auth(ValidRoles.consumer)
  getMe(
    // @GetUser() es un decorador personalizado para obtener el usuario autenticado.
    @GetUser() user: User,
  ) {
    console.log(user);
  }
}
