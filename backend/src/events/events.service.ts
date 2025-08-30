import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';

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
  ) {}

  async create(createEventDto: CreateEventDto, organizationId: string) {
    try {
      const { vehicleId, eventDate, ...eventData } = createEventDto;

      const vehicle = await this.vehicleRepository.findOneBy({ id: vehicleId });
      if (!vehicle) {
        throw new NotFoundException(`Vehicle with id ${vehicleId} not found`);
      }

      const organization = await this.organizationRepository.findOneBy({ id: organizationId });
      if (!organization) {
        throw new NotFoundException(`Organization with id ${organizationId} not found`);
      }

      const event = this.eventRepository.create({
        ...eventData,
        eventDate: new Date(eventDate),
        vehicle,
        organization
      });

      await this.eventRepository.save(event);
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
    const { limit = 10, offset = 0 } = paginationDto;
    
    const events = await this.eventRepository.find({
      where: { 
        vehicle: { id: vehicleId },
        isActive: true 
      },
      relations: ['vehicle', 'organization'],
      take: limit,
      skip: offset,
      order: { eventDate: 'DESC' }
    });

    return events;
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
      const { vehicleId, eventDate, ...eventData } = updateEventDto;
      
      if (vehicleId) {
        const vehicle = await this.vehicleRepository.findOneBy({ id: vehicleId });
        if (!vehicle) {
          throw new NotFoundException(`Vehicle with id ${vehicleId} not found`);
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

  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
