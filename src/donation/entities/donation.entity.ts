import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Donor } from '../../donor/entities/donor.entity';

@Entity()
export class Donation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Donor, { eager: true })
  @JoinColumn({ name: 'donorId' })
  donor: Donor;

  @Column()
  donorId: number;

  @Column({ type: 'varchar', length: 3 })
  bloodType: string;

  @Column({ type: 'varchar', length: 100 })
  bloodBankCity: string;

  @Column({ type: 'boolean', default: false })
  virusTestNegative: boolean;

  @Column({ type: 'date' })
  expirationDate: Date;

  @CreateDateColumn()
  donationDate: Date;

  @Column({ type: 'boolean', default: false })
  isUsed: boolean;
}
