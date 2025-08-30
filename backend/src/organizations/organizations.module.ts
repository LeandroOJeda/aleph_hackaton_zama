import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { Organization } from './entities/organization.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  imports: [
    TypeOrmModule.forFeature([Organization]),
    AuthModule
  ],
  exports: [OrganizationsService]
})
export class OrganizationsModule {}
