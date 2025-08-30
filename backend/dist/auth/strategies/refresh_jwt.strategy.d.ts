import { Strategy } from 'passport-jwt';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
declare const RefreshJwtStrategy_base: new (...args: any[]) => Strategy;
export declare class RefreshJwtStrategy extends RefreshJwtStrategy_base {
    private readonly userRepository;
    constructor(userRepository: Repository<User>, configService: ConfigService);
    validate(payload: JwtPayload): Promise<User>;
}
export {};
