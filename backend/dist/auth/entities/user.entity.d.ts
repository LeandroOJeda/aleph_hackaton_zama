import { Role } from './role.entity';
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
    checkFieldsBeforeInsert(): void;
    checkFieldsBeforeUpdate(): void;
}
