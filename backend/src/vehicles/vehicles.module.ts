import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { Vehicle } from './entities/vehicle.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [VehiclesController],
  providers: [VehiclesService],
  imports: [
    TypeOrmModule.forFeature([Vehicle]),
    HttpModule,
    ConfigModule,
    AuthModule
  ],
  exports: [VehiclesService, TypeOrmModule]
})
export class VehiclesModule {}
