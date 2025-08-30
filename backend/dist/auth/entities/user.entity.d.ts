import { Role } from './role.entity';
import { Organization } from '../../organizations/entities/organization.entity';
export declare class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isActive: boolean;
    firstTime: boolean;
    createdAt: Date;
    roles: Role[];
    organization: Organization;
    checkFieldsBeforeInsert(): void;
    checkFieldsBeforeUpdate(): void;
}
