import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from './entities/vehicle.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class VehiclesService {
  private readonly logger = new Logger('VehiclesService');

  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  async create(createVehicleDto: CreateVehicleDto) {
    try {
      const vehicle = this.vehicleRepository.create(createVehicleDto);
      await this.vehicleRepository.save(vehicle);
      return vehicle;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    
    const vehicles = await this.vehicleRepository.find({
      take: limit,
      skip: offset,
      where: { isActive: true }
    });

    return vehicles;
  }

  async findOne(term: string) {
    let vehicle: Vehicle;

    if (term.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      vehicle = await this.vehicleRepository.findOneBy({ id: term });
    } else {
      vehicle = await this.vehicleRepository.findOne({
        where: [
          { licensePlate: term.toUpperCase() },
          { chassisNumber: term.toUpperCase() }
        ]
      });
    }

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with term "${term}" not found`);
    }

    return vehicle;
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    const vehicle = await this.vehicleRepository.preload({
      id: id,
      ...updateVehicleDto,
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with id: ${id} not found`);
    }

    try {
      await this.vehicleRepository.save(vehicle);
      return vehicle;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async remove(id: string) {
    const vehicle = await this.findOne(id);
    
    try {
      vehicle.isActive = false;
      await this.vehicleRepository.save(vehicle);
      return { message: 'Vehicle deactivated successfully' };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
