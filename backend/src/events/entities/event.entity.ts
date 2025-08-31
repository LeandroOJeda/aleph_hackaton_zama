import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { Organization } from '../../organizations/entities/organization.entity';

@Entity('vehicle_events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  kilometers: number;

  @Column('text')
  description: string;

  @Column('timestamp')
  eventDate: Date;

  @Column('text')
  location: string;

  @Column('bool', { default: true })
  isActive: boolean;

  @Column('varchar', { nullable: true })
  blockchainBlockId: string;

  @Column('varchar', { nullable: true })
  blockchainTxHash: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Vehicle, { eager: true })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @ManyToOne(() => Organization, { eager: true })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;
}
