import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { User } from '../auth/entities/user.entity';
import { Role } from '../auth/entities/role.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { Event } from '../events/entities/event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Organization, Vehicle, Event])
  ],
  providers: [SeedService],
  exports: [SeedService]
})
export class DatabaseModule {}
