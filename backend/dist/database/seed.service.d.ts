import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { Role } from '../auth/entities/role.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { Event } from '../events/entities/event.entity';
export declare class SeedService {
    private userRepository;
    private roleRepository;
    private organizationRepository;
    private vehicleRepository;
    private eventRepository;
    constructor(userRepository: Repository<User>, roleRepository: Repository<Role>, organizationRepository: Repository<Organization>, vehicleRepository: Repository<Vehicle>, eventRepository: Repository<Event>);
    seed(): any;
    private createRoles;
    private createOrganizations;
    private createUsers;
    private getRoleDescription;
    private createVehicles;
    private createEvents;
    clearDatabase(): any;
}
