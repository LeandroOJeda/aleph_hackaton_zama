import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Guest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  documentNumber: string;

  @Column()
  birthDate: Date;
  
  @Column({ default: false })
  isConfirmed: boolean;
}
