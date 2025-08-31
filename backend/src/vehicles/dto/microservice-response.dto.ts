export class MicroserviceVehicleDataDto {
  vehicleId: string;
  isActive: boolean;
  hasValidVTV: boolean;
  lastKilometers: string;
  isRegistered: boolean;
}

export class MicroserviceResponseDto {
  success: boolean;
  data: MicroserviceVehicleDataDto;
  timestamp: string;
}