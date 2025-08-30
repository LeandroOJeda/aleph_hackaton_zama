import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities/organization.entity';
import { OrganizationTypes, OrganizationTypeDescriptions } from './interfaces/organization-types';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) {}

  async create(createOrganizationDto: CreateOrganizationDto) {
    try {
      const organization = this.organizationRepository.create(createOrganizationDto);
      await this.organizationRepository.save(organization);
      return organization;
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async findAll(paginationDto: PaginationDto = { limit: 10, offset: 0 }) {
    const { limit, offset } = paginationDto;

    const [organizations, total] = await this.organizationRepository.findAndCount({
      relations: ['users'],
      take: limit,
      skip: offset,
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });

    return {
      organizations,
      total,
      limit,
      offset,
    };
  }

  async findOne(id: string) {
    const organization = await this.organizationRepository.findOne({
      where: { id, isActive: true },
      relations: ['users'],
    });

    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }

    return organization;
  }

  async findByType(type: string, paginationDto: PaginationDto = { limit: 10, offset: 0 }) {
    const { limit, offset } = paginationDto;

    const [organizations, total] = await this.organizationRepository.findAndCount({
      where: { type, isActive: true },
      relations: ['users'],
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });

    return {
      organizations,
      total,
      limit,
      offset,
    };
  }

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    const organization = await this.organizationRepository.preload({
      id,
      ...updateOrganizationDto,
    });

    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }

    try {
      await this.organizationRepository.save(organization);
      return organization;
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async remove(id: string) {
    const organization = await this.findOne(id);
    
    // Soft delete
    organization.isActive = false;
    await this.organizationRepository.save(organization);

    return { message: 'Organization deactivated successfully' };
  }

  getOrganizationTypes() {
    return Object.values(OrganizationTypes).map(type => ({
      id: type,
      name: type,
      description: OrganizationTypeDescriptions[type],
    }));
  }

  private handleDBError(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    console.log(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
