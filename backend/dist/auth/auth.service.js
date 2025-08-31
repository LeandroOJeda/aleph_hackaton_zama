"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt = require("bcrypt");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const role_entity_1 = require("./entities/role.entity");
let AuthService = class AuthService {
    constructor(userRepository, roleRepository, jwtService, configService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async createUser(createUserDto) {
        try {
            const { password, ...userData } = createUserDto;
            const userRole = await this.roleRepository.findOne({
                where: { name: 'user' },
                select: { id: true, name: true },
            });
            if (!userRole) {
                throw new common_1.InternalServerErrorException('Role "user" not found');
            }
            const user = this.userRepository.create({
                ...userData,
                password: bcrypt.hashSync(password, 10),
                roles: [userRole],
            });
            await this.userRepository.save(user);
            delete user.password;
            return {
                ...user,
                accessToken: this.getJwtToken({ id: user.id }, '24h'),
                refreshToken: this.getRefreshToken({ id: user.id }),
            };
        }
        catch (error) {
            this.handleDBError(error);
        }
    }
    async loginUser(loginUserDto) {
        const { password, email } = loginUserDto;
        const user = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.roles', 'role')
            .select([
            'user.id',
            'user.email',
            'user.password',
            'user.firstTime',
            'role.id',
            'role.name',
            'role.description',
        ])
            .where('user.email = :email', { email })
            .getOne();
        if (!user)
            throw new common_1.UnauthorizedException('Credentials not valid');
        if (!bcrypt.compareSync(password, user.password))
            throw new common_1.UnauthorizedException('Credentials not valid');
        delete user.password;
        return {
            ...user,
            accessToken: this.getJwtToken({ id: user.id }, '1d'),
            refreshToken: this.getRefreshToken({ id: user.id }),
        };
    }
    async refreshToken(user) {
        const { id } = user;
        try {
            const user = await this.userRepository.findOne({
                where: { id },
                select: { email: true, id: true, firstTime: true },
                relations: ['roles'],
            });
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            return {
                ...user,
                accessToken: this.getJwtToken({ id: user.id }, '24h'),
                refreshToken: this.getRefreshToken({ id: user.id }),
            };
        }
        catch (error) {
            if (error.name === 'TokenExpiredError')
                throw new common_1.UnauthorizedException('Refresh token expired or invalid');
            throw error;
        }
    }
    async changeDefaultPassword(changeDefaultPasswordDto) {
        const { oldPassword, newPassword, email } = changeDefaultPasswordDto;
        const user = await this.userRepository
            .createQueryBuilder('user')
            .addSelect('user.password')
            .leftJoinAndSelect('user.roles', 'role')
            .where('user.email = :email', { email })
            .getOne();
        if (!user)
            throw new common_1.UnauthorizedException('Credentials not valid, "email" or "oldPassword" invalid');
        if (!bcrypt.compareSync(oldPassword, user.password))
            throw new common_1.UnauthorizedException('Credentials not valid, "email" or "oldPassword" invalid');
        user.password = bcrypt.hashSync(newPassword, 10);
        user.firstTime = false;
        delete user.password;
        await this.userRepository.save(user);
        return {
            ...user,
            accessToken: this.getJwtToken({ id: user.id }, '1d'),
            refreshToken: this.getRefreshToken({ id: user.id }),
        };
    }
    handleDBError(error) {
        if (error.code === '23505')
            throw new common_1.BadRequestException(error.detail);
        console.log(error);
        throw new common_1.InternalServerErrorException('Please check server logs');
    }
    getJwtToken(payload, expiresIn) {
        return this.jwtService.sign(payload, { expiresIn });
    }
    getRefreshToken(payload) {
        return this.jwtService.sign(payload, {
            secret: this.configService.get('REFRESH_JWT_SECRET'),
            expiresIn: '30d',
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _c : Object, typeof (_d = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _d : Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map