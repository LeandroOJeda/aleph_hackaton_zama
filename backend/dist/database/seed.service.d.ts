import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { Role } from '../auth/entities/role.entity';
export declare class SeedService {
    private userRepository;
    private roleRepository;
    constructor(userRepository: Repository<User>, roleRepository: Repository<Role>);
    seed(): Promise<void>;
    private createRoles;
    private createUsers;
    private getRoleDescription;
    clearDatabase(): Promise<void>;
}
