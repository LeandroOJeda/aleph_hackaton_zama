import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { User } from '../auth/entities/user.entity';
import { Role } from '../auth/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role])
  ],
  providers: [SeedService],
  exports: [SeedService]
})
export class DatabaseModule {}
