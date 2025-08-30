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
    createUser(createUserDto: CreateUserDto): Promise<{
        accessToken: string;
        refreshToken: string;
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        isActive: boolean;
        firstTime: boolean;
        createdAt: Date;
        roles: import("./entities/role.entity").Role[];
        organization: import("../organizations/entities/organization.entity").Organization;
    }>;
    loginUser(loginUserDto: LoginUserDto): Promise<{
        accessToken: string;
        refreshToken: string;
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        isActive: boolean;
        firstTime: boolean;
        createdAt: Date;
        roles: import("./entities/role.entity").Role[];
        organization: import("../organizations/entities/organization.entity").Organization;
    }>;
    refreshToken(user: User): Promise<{
        accessToken: string;
        refreshToken: string;
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        isActive: boolean;
        firstTime: boolean;
        createdAt: Date;
        roles: import("./entities/role.entity").Role[];
        organization: import("../organizations/entities/organization.entity").Organization;
    }>;
    changeDefaultPassword(changeDefaultPasswordDto: ChangeDefaultPasswordDto): Promise<{
        accessToken: string;
        refreshToken: string;
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        isActive: boolean;
        firstTime: boolean;
        createdAt: Date;
        roles: import("./entities/role.entity").Role[];
        organization: import("../organizations/entities/organization.entity").Organization;
    }>;
    getMe(user: User): void;
}
