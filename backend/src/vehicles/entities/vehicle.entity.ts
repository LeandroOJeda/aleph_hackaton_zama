import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  licensePlate: string; // Nro patente

  @Column('text', { unique: true })
  chassisNumber: string; // Nro chasis

  @Column('text')
  location: string; // Radicación

  @Column('text')
  brand: string; // Marca

  @Column('text')
  model: string; // Modelo

  @Column('bool', { default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relación con eventos del vehículo
  // @OneToMany(() => VehicleEvent, (event) => event.vehicle)
  // events: VehicleEvent[];
}
