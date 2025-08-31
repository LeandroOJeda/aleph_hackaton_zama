import { Vehicle } from '../entities/vehicle.entity';
import { BlockchainInfoDto } from './blockchain-info.dto';

export class VehicleWithBlockchainDto extends Vehicle {
  blockchain: BlockchainInfoDto;
}