import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from './entities/vehicle.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { VehicleWithBlockchainDto } from './dto/vehicle-with-blockchain.dto';
import { BlockchainInfoDto } from './dto/blockchain-info.dto';
import { MicroserviceResponseDto } from './dto/microservice-response.dto';

@Injectable()
export class VehiclesService {
  private readonly logger = new Logger('VehiclesService');

  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
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

  async findOne(term: string): Promise<VehicleWithBlockchainDto> {
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

    // Consultar información de blockchain
    const blockchainInfo = await this.getBlockchainInfo(vehicle.licensePlate);

    // Retornar vehículo con información de blockchain
    const result = new VehicleWithBlockchainDto();
    Object.assign(result, vehicle);
    result.blockchain = blockchainInfo;
    
    return result;
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

  private async getBlockchainInfo(licensePlate: string): Promise<BlockchainInfoDto> {
    try {
      // URL del microservicio (configurar en .env)
      const microserviceUrl = this.configService.get('MICROSERVICE_URL') || 'http://localhost:3001';
      const response = await firstValueFrom(
        this.httpService.get<MicroserviceResponseDto>(`${microserviceUrl}/api/vehicles/${licensePlate}/info`)
      );

      if (response.data && response.data.success) {
        const blockchainInfo = new BlockchainInfoDto();
        blockchainInfo.isRegistered = response.data.data.isRegistered;
        blockchainInfo.isActive = response.data.data.isActive;
        blockchainInfo.hasValidVTV = response.data.data.hasValidVTV;
        blockchainInfo.lastKilometers = response.data.data.lastKilometers;
        blockchainInfo.verified = response.data.data.isRegistered;
        
        return blockchainInfo;
      } else {
        return this.createEmptyBlockchainInfo();
      }
    } catch (error) {
      this.logger.warn(`Could not fetch blockchain info for vehicle ${licensePlate}: ${error.message}`);
      return this.createEmptyBlockchainInfo();
    }
  }

  private createEmptyBlockchainInfo(): BlockchainInfoDto {
    const blockchainInfo = new BlockchainInfoDto();
    blockchainInfo.isRegistered = false;
    blockchainInfo.isActive = false;
    blockchainInfo.hasValidVTV = false;
    blockchainInfo.lastKilometers = '0';
    blockchainInfo.verified = false;
    
    return blockchainInfo;
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
