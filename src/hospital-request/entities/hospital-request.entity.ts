import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class HospitalRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  hospitalName: string;

  @Column()
  city: string;

  @Column()
  bloodType: string;

  @Column()
  quantity: number;

  @Column({ type: 'enum', enum: ['Immediate', 'Urgent', 'Normal'] })
  patientStatus: 'Immediate' | 'Urgent' | 'Normal';

  @CreateDateColumn()
  requestedAt: Date;

  @Column({ default: false })
  isFulfilled: boolean;
}
