export class BlockchainBlockDto {
  blockId: string;
  vehicleId: string;
  kilometers: string;
  details: string;
  origin: string;
  creator: string;
  timestamp: string;
}

export class MicroserviceBlocksResponseDto {
  success: boolean;
  data: BlockchainBlockDto[];
  count: number;
  timestamp: string;
}