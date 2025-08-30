import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { ValidRoles } from '../auth/interfaces/valid_roles';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @Auth(ValidRoles.aseguradora, ValidRoles.taller, ValidRoles.concesionaria, ValidRoles.admin, ValidRoles.superadmin)
  create(
    @Body() createEventDto: CreateEventDto,
    @GetUser() user: User
  ) {
    return this.eventsService.create(createEventDto, user.organization?.id);
  }

  @Get()
  @Auth()
  findAll(
    @Query() paginationDto: PaginationDto,
    @GetUser() user: User
  ) {
    const organizationId = user.organization?.id;
    return this.eventsService.findAll(paginationDto, organizationId);
  }

  @Get('vehicle/:vehicleId')
  @Auth()
  findByVehicle(
    @Param('vehicleId', ParseUUIDPipe) vehicleId: string,
    @Query() paginationDto: PaginationDto
  ) {
    return this.eventsService.findByVehicle(vehicleId, paginationDto);
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.aseguradora, ValidRoles.taller, ValidRoles.concesionaria, ValidRoles.admin, ValidRoles.superadmin)
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateEventDto: UpdateEventDto,
    @GetUser() user: User
  ) {
    return this.eventsService.update(id, updateEventDto, user.organization?.id);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin, ValidRoles.superadmin)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User
  ) {
    return this.eventsService.remove(id, user.organization?.id);
  }
}
