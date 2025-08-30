import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshJwtStrategy } from './strategies/refresh_jwt.strategy';
import { Role } from './entities/role.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshJwtStrategy],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, Role]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: '2h' },
        };
      },
    }),
  ],
  exports: [
    TypeOrmModule,
    JwtStrategy,
    RefreshJwtStrategy,
    PassportModule,
    JwtModule,
  ],
})
export class AuthModule {}
