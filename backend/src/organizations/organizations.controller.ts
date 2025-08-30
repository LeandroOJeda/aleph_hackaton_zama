import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid_roles';

@Controller('organizations')
@Auth(ValidRoles.admin, ValidRoles.superadmin)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationsService.create(createOrganizationDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.organizationsService.findAll(paginationDto);
  }

  @Get('types')
  getOrganizationTypes() {
    return this.organizationsService.getOrganizationTypes();
  }

  @Get('by-type/:type')
  findByType(
    @Param('type') type: string,
    @Query() paginationDto: PaginationDto
  ) {
    return this.organizationsService.findByType(type, paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.organizationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateOrganizationDto: UpdateOrganizationDto
  ) {
    return this.organizationsService.update(id, updateOrganizationDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.organizationsService.remove(id);
  }
}
