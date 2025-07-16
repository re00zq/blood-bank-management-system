import {
  IsString,
  Matches,
  Length,
  IsEmail,
  IsDate,
  IsIn,
  IsNotEmpty,
  MaxDate,
  IsOptional,
} from 'class-validator';

export class CreateDonorDto {
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  @Length(1, 50, { message: 'First name must be between 1 and 50 characters' })
  @Matches(/^[A-Za-z\s]{1,50}$/, {
    message: 'First name must contain only letters and spaces',
  })
  firstName: string;

  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  @Length(1, 50, { message: 'Last name must be between 1 and 50 characters' })
  @Matches(/^[A-Za-z\s]{1,50}$/, {
    message: 'Last name must contain only letters and spaces',
  })
  lastName: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'Phone number must be a string' })
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message:
      'Phone number must be a valid international number (up to 15 digits, optional + prefix)',
  })
  phoneNumber: string;

  @IsString({ message: 'Blood type must be a string' })
  @IsNotEmpty({ message: 'Blood type is required' })
  @IsIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
    message: 'Blood type must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-',
  })
  bloodType: string;

  @IsString({ message: 'National ID must be a string' })
  @IsNotEmpty({ message: 'National ID is required' })
  @Matches(
    /^([2-3])([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])(0[1-4]|[12][1-9]|3[1-5]|88)[0-9]{3}([13579]|[2468])[0-9]$/,
    {
      message: 'National ID is invalid',
    },
  )
  nationalId: string;

  @IsDate({ message: 'Date of birth must be a valid date' })
  @IsNotEmpty({ message: 'Date of birth is required' })
  @MaxDate(new Date(new Date().setFullYear(new Date().getFullYear() - 16)), {
    message: 'Donor must be at least 16 years old',
  })
  dateOfBirth: Date;

  @IsOptional()
  @IsDate({ message: 'Last donation date must be a valid date' })
  @MaxDate(new Date(), {
    message: 'Last donation date cannot be in the future',
  })
  lastDonationDate?: Date;

  @IsString({ message: 'City must be a string' })
  @IsNotEmpty({ message: 'City is required' })
  @Length(1, 100, { message: 'City must be between 1 and 100 characters' })
  @Matches(/^[A-Za-z\s]{1,100}$/, {
    message: 'City must contain only letters and spaces',
  })
  city: string;
}
