import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class DonorLoginDto {
  @IsString({ message: 'National ID must be a string' })
  @IsNotEmpty({ message: 'National ID is required' })
  @Matches(
    /^([2-3])([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])(0[1-4]|[12][1-9]|3[1-5]|88)[0-9]{3}([13579]|[2468])[0-9]$/,
    {
      message: 'National ID is invalid',
    },
  )
  nationalId: string;
}
