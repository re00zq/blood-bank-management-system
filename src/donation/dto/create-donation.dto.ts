import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class CreateDonationDto {
  @IsString()
  @IsNotEmpty({ message: 'Blood bank city is required' })
  @Length(1, 100, { message: 'City name must be between 1 and 100 characters' })
  bloodBankCity: string;

  @IsBoolean({ message: 'Virus test result must be a boolean' })
  virusTestNegative: boolean;

  @IsDateString({}, { message: 'Expiration date must be a valid date string' })
  expirationDate: string;
}
