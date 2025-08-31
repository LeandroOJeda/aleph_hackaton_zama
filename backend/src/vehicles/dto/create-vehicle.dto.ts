import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @MinLength(6)
  @MaxLength(10)
  @Matches(/^[A-Z0-9-]+$/, { message: 'License plate must contain only uppercase letters, numbers and dashes' })
  licensePlate: string;

  @IsString()
  @MinLength(10)
  @MaxLength(25)
  @Matches(/^[A-Z0-9]+$/, { message: 'Chassis number must contain only uppercase letters and numbers' })
  chassisNumber: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  location: string;

  @IsString()
  @MinLength(2)
  @MaxLength(30)
  brand: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  model: string;
}
