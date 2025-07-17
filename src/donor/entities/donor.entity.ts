import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import {
  IsString,
  Matches,
  Length,
  IsEmail,
  IsDate,
  IsIn,
  IsNotEmpty,
  MaxDate,
} from 'class-validator';

@Entity()
export class Donor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  @Length(1, 50, { message: 'First name must be between 1 and 50 characters' })
  @Matches(/^[A-Za-z\s]{1,50}$/, {
    message: 'First name must contain only letters and spaces',
  })
  firstName: string;

  @Column({ type: 'varchar', length: 50 })
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  @Length(1, 50, { message: 'Last name must be between 1 and 50 characters' })
  @Matches(/^[A-Za-z\s]{1,50}$/, {
    message: 'Last name must contain only letters and spaces',
  })
  lastName: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  @IsString({ message: 'Phone number must be a string' })
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message:
      'Phone number must be a valid international number (up to 15 digits, optional + prefix)',
  })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 3 })
  @IsString({ message: 'Blood type must be a string' })
  @IsNotEmpty({ message: 'Blood type is required' })
  @IsIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
    message: 'Blood type must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-',
  })
  bloodType: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  @IsString({ message: 'National ID must be a string' })
  @IsNotEmpty({ message: 'National ID is required' })
  @Matches(/^[23]\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{7}$/, {
    message: 'National ID is invalid',
  })
  nationalId: string;

  @Column({ type: 'date', nullable: true })
  @IsDate({ message: 'Last donation date must be a valid date' })
  @MaxDate(new Date(), {
    message: 'Last donation date cannot be in the future',
  })
  lastDonationDate: Date;

  @Column({ type: 'varchar', length: 100 })
  @IsString({ message: 'City must be a string' })
  @IsNotEmpty({ message: 'City is required' })
  @Length(1, 100, { message: 'City must be between 1 and 100 characters' })
  @Matches(/^[A-Za-z\s]{1,100}$/, {
    message: 'City must contain only letters and spaces',
  })
  city: string;
}
