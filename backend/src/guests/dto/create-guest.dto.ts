import { IsString, IsEmail, IsNumber } from 'class-validator';

export class CreateGuestDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNumber()
  eventId: number;
}