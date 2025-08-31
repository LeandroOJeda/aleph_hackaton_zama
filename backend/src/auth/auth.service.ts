import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from './entities/role.entity';
import { ChangeDefaultPasswordDto } from './dto/change_default_password_dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      // Obtener el rol "user"
      const userRole = await this.roleRepository.findOne({
        where: { name: 'user' },
        select: { id: true, name: true },
      });

      if (!userRole) {
        throw new InternalServerErrorException('Role "user" not found');
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
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
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
    if (!user) throw new UnauthorizedException('Credentials not valid');
    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials not valid');
    delete user.password;
    return {
      ...user,
      accessToken: this.getJwtToken({ id: user.id }, '1d'),
      refreshToken: this.getRefreshToken({ id: user.id }),
    };
  }

  async refreshToken(user: User) {
    const { id } = user;
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        select: { email: true, id: true, firstTime: true },
        relations: ['roles'],
      });
      
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      
      return {
        ...user,
        accessToken: this.getJwtToken({ id: user.id }, '24h'),
        refreshToken: this.getRefreshToken({ id: user.id }),
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError')
        throw new UnauthorizedException('Refresh token expired or invalid');
      throw error;
    }
  }

  async changeDefaultPassword(
    changeDefaultPasswordDto: ChangeDefaultPasswordDto,
  ) {
    const { oldPassword, newPassword, email } = changeDefaultPasswordDto;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .leftJoinAndSelect('user.roles', 'role')
      .where('user.email = :email', { email })
      .getOne();
    if (!user)
      throw new UnauthorizedException(
        'Credentials not valid, "email" or "oldPassword" invalid',
      );
    if (!bcrypt.compareSync(oldPassword, user.password))
      throw new UnauthorizedException(
        'Credentials not valid, "email" or "oldPassword" invalid',
      );
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

  private handleDBError(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    console.log(error);
    throw new InternalServerErrorException('Please check server logs');
  }

  private getJwtToken(payload: JwtPayload, expiresIn: string) {
    return this.jwtService.sign(payload, { expiresIn });
  }
  private getRefreshToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_JWT_SECRET'),
      expiresIn: '30d',
    });
  }
}
