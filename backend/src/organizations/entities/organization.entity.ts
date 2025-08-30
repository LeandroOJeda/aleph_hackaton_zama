import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  type: string;

  @Column('text', { nullable: true })
  taxId: string; // RUT, NIT, Tax ID

  @Column('text', { nullable: true })
  address: string;

  @Column('text', { nullable: true })
  phone: string;

  @Column('text', { nullable: true })
  email: string;

  @Column('bool', { default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.organization)
  users: User[];
}
