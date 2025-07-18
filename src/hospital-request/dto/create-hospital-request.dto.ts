import { IsString, IsNotEmpty, IsNumber, IsPositive, IsEnum, IsBoolean, IsOptional } from 'class-validator';

export enum PatientStatus {
  Immediate = 'Immediate',
  Urgent = 'Urgent',
  Normal = 'Normal',
}

export class CreateHospitalRequestDto {
  @IsString()
  @IsNotEmpty()
  hospitalName: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  bloodType: string;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsEnum(PatientStatus)
  patientStatus: PatientStatus;

  @IsBoolean()
  @IsOptional()
  isFulfilled?: boolean;
}