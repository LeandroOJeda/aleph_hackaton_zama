import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EventsService {
  private readonly logger = new Logger('EventsService');

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async create(createEventDto: CreateEventDto, organizationId: string) {
    try {
      const { licensePlate, eventDate, ...eventData } = createEventDto;

      const vehicle = await this.vehicleRepository.findOne({
        where: { licensePlate: licensePlate.toUpperCase() }
      });
      if (!vehicle) {
        throw new NotFoundException(`Vehicle with license plate ${licensePlate} not found`);
      }

      const organization = await this.organizationRepository.findOneBy({ id: organizationId });
      if (!organization) {
        throw new NotFoundException(`Organization with id ${organizationId} not found`);
      }

      // Crear evento en base de datos local
      const event = this.eventRepository.create({
        ...eventData,
        eventDate: new Date(eventDate),
        vehicle,
        organization
      });

      await this.eventRepository.save(event);

      // Crear bloque en blockchain
      try {
        const blockchainResult = await this.createBlockchainBlock(vehicle.licensePlate, createEventDto.kilometers, createEventDto.description, organization.name);
        
        // Actualizar evento con información de blockchain
        event.blockchainBlockId = blockchainResult.blockId;
        event.blockchainTxHash = blockchainResult.transactionHash;
        await this.eventRepository.save(event);
        
        this.logger.log(`Blockchain block created for event ${event.id}: Block ID ${blockchainResult.blockId}`);
      } catch (blockchainError) {
        this.logger.warn(`Failed to create blockchain block for event ${event.id}: ${blockchainError.message}`);
        // El evento se crea aunque falle la blockchain
      }

      return event;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll(paginationDto: PaginationDto, organizationId?: string) {
    const { limit = 10, offset = 0 } = paginationDto;
    
    const queryBuilder = this.eventRepository.createQueryBuilder('event')
      .leftJoinAndSelect('event.vehicle', 'vehicle')
      .leftJoinAndSelect('event.organization', 'organization')
      .where('event.isActive = :isActive', { isActive: true })
      .take(limit)
      .skip(offset)
      .orderBy('event.eventDate', 'DESC');

    if (organizationId) {
      queryBuilder.andWhere('organization.id = :organizationId', { organizationId });
    }

    const events = await queryBuilder.getMany();
    return events;
  }

  async findByVehicle(vehicleId: string, paginationDto: PaginationDto) {
    // Primero obtenemos el vehículo para conseguir la patente
    const vehicle = await this.vehicleRepository.findOneBy({ id: vehicleId });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with id ${vehicleId} not found`);
    }

    // Consultar historial desde blockchain usando la patente
    try {
      const microserviceUrl = this.configService.get('MICROSERVICE_URL') || 'http://localhost:3001';
      const response = await firstValueFrom(
        this.httpService.get(`${microserviceUrl}/api/vehicles/${vehicle.licensePlate}/blocks`)
      );

      if (response.data && response.data.success) {
        // Mapear los bloques de blockchain a formato de eventos
        const blockchainBlocks = response.data.data || [];
        const mappedEvents = blockchainBlocks.map(block => ({
          id: block.blockId,
          kilometers: parseInt(block.kilometers) || 0,
          description: block.details || 'Sin descripción',
          eventDate: new Date(parseInt(block.timestamp) * 1000), // Convertir timestamp
          location: block.origin || 'Ubicación desconocida',
          isActive: true,
          vehicle: vehicle,
          organization: {
            name: block.origin || 'Organización desconocida',
            type: 'blockchain'
          }
        }));

        return mappedEvents;
      } else {
        // Si no hay datos en blockchain, retornar array vacío
        return [];
      }
    } catch (error) {
      this.logger.warn(`Could not fetch blockchain history for vehicle ${vehicle.licensePlate}: ${error.message}`);
      // En caso de error, retornar array vacío
      return [];
    }
  }

  async findOne(id: string) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['vehicle', 'organization']
    });

    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto, organizationId: string) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['organization']
    });

    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    if (event.organization.id !== organizationId) {
      throw new BadRequestException('You can only update events from your organization');
    }

    try {
      const { licensePlate, eventDate, ...eventData } = updateEventDto;
      
      if (licensePlate) {
        const vehicle = await this.vehicleRepository.findOne({
          where: { licensePlate: licensePlate.toUpperCase() }
        });
        if (!vehicle) {
          throw new NotFoundException(`Vehicle with license plate ${licensePlate} not found`);
        }
        event.vehicle = vehicle;
      }

      if (eventDate) {
        event.eventDate = new Date(eventDate);
      }

      Object.assign(event, eventData);
      await this.eventRepository.save(event);
      
      return event;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async remove(id: string, organizationId: string) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['organization']
    });

    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    if (event.organization.id !== organizationId) {
      throw new BadRequestException('You can only delete events from your organization');
    }
    
    try {
      event.isActive = false;
      await this.eventRepository.save(event);
      return { message: 'Event deactivated successfully' };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  private async createBlockchainBlock(vehicleId: string, kilometers: number, details: string, origin: string) {
    const microserviceUrl = this.configService.get('MICROSERVICE_URL') || 'http://localhost:3001';
    
    const blockData = {
      vehicleId,
      kilometers,
      details,
      origin
    };

    const response = await firstValueFrom(
      this.httpService.post(`${microserviceUrl}/api/vehicles/blocks`, blockData)
    );

    if (!response.data || !response.data.success) {
      throw new Error(`Failed to create blockchain block: ${response.data?.message || 'Unknown error'}`);
    }

    return {
      blockId: response.data.data.blockId,
      transactionHash: response.data.data.transactionHash,
      gasUsed: response.data.data.gasUsed,
      blockNumber: response.data.data.blockNumber
    };
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
