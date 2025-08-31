import {
  IsString,
  IsNumber,
  IsDateString,
  MinLength,
  MaxLength,
  IsPositive,
} from 'class-validator';

export class CreateEventDto {
  @IsNumber()
  @IsPositive()
  kilometers: number;

  @IsString()
  @MinLength(5)
  @MaxLength(500)
  description: string;

  @IsDateString()
  eventDate: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  location: string;

  @IsString()
  @MinLength(1)
  @MaxLength(20)
  licensePlate: string;
}
