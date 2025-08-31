import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from './entities/role.entity';
import { ChangeDefaultPasswordDto } from './dto/change_default_password_dto';
export declare class AuthService {
    private readonly userRepository;
    private readonly roleRepository;
    private readonly jwtService;
    private readonly configService;
    constructor(userRepository: Repository<User>, roleRepository: Repository<Role>, jwtService: JwtService, configService: ConfigService);
    createUser(createUserDto: CreateUserDto): unknown;
    loginUser(loginUserDto: LoginUserDto): unknown;
    refreshToken(user: User): unknown;
    changeDefaultPassword(changeDefaultPasswordDto: ChangeDefaultPasswordDto): unknown;
    private handleDBError;
    private getJwtToken;
    private getRefreshToken;
}
