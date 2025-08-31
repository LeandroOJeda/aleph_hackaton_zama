import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { ChangeDefaultPasswordDto } from './dto/change_default_password_dto';
export declare class AuthController {
    private readonly authService;
    private readonly jwtService;
    constructor(authService: AuthService, jwtService: JwtService);
    createUser(createUserDto: CreateUserDto): unknown;
    loginUser(loginUserDto: LoginUserDto): unknown;
    refreshToken(user: User): unknown;
    changeDefaultPassword(changeDefaultPasswordDto: ChangeDefaultPasswordDto): unknown;
    getMe(user: User): void;
}
