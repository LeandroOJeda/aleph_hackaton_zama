import { ethers } from 'ethers';
import { createError } from '../middleware/errorHandler.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class VehicleService {
  constructor() {
    this.rpcUrl = process.env.SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID';
    this.privateKey = process.env.SEPOLIA_PRIVATE_KEY;
    this.contractAddress = process.env.CONTRACT_ADDRESS;
    
    
    // Configurar provider
    this.provider = new ethers.JsonRpcProvider(this.rpcUrl);
    
    // Configurar wallet si hay clave privada
    if (this.privateKey) {
      this.wallet = new ethers.Wallet(this.privateKey, this.provider);
    }
    
    // Cargar ABI del contrato
    this.loadContractABI();
  }

  /**
   * Carga el ABI del contrato desde el archivo de artifacts
   */
  loadContractABI() {
    try {
      const artifactPath = path.join(__dirname, '../../artifacts/contracts/TransactionRegistry.sol/VehicleInfoRegistry.json');
      const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
      this.contractABI = artifact.abi;
      
      // Crear instancia del contrato si tenemos la dirección
      if (this.contractAddress && this.wallet) {
        this.contract = new ethers.Contract(this.contractAddress, this.contractABI, this.wallet);
      }
    } catch (error) {
      console.error('Error cargando ABI del contrato:', error.message);
    }
  }

  /**
   * Crea un nuevo bloque de información vehicular
   */
  async createInfoBlock(vehicleId, kilometers, details, origin) {
    try {
      if (!this.contract) {
        throw createError('Contrato no configurado correctamente', 500);
      }

      const tx = await this.contract.createInfoBlock(vehicleId, kilometers, details, origin);
      const receipt = await tx.wait();
      
      // Extraer el ID del bloque del evento
      const event = receipt.logs.find(log => {
        try {
          const parsed = this.contract.interface.parseLog(log);
          return parsed.name === 'InfoBlockCreated';
        } catch {
          return false;
        }
      });
      
      let blockId = null;
      if (event) {
        const parsed = this.contract.interface.parseLog(event);
        blockId = parsed.args[0];
      }

      return {
        success: true,
        transactionHash: tx.hash,
        blockId: blockId,
        gasUsed: receipt.gasUsed.toString(),
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Obtiene información de un vehículo
   */
  async getVehicleInfo(vehicleId) {
    try {
      if (!this.contract) {
        throw createError('Contrato no configurado correctamente', 500);
      }

      const vehicleInfo = await this.contract.getVehicleInfo(vehicleId);
      
      return {
        vehicleId: vehicleId,
        isActive: vehicleInfo[0],
        hasValidVTV: vehicleInfo[1],
        lastKilometers: vehicleInfo[2].toString(),
        isRegistered: vehicleInfo[3]
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Obtiene todos los bloques de un vehículo
   */
  async getVehicleBlocks(vehicleId) {
    try {
      if (!this.contract) {
        throw createError('Contrato no configurado correctamente', 500);
      }

      const blockIds = await this.contract.getVehicleBlocks(vehicleId);
      const blocks = [];
      
      for (const blockId of blockIds) {
        const blockInfo = await this.contract.getInfoBlock(blockId);
        blocks.push({
          blockId: blockInfo[0].toString(),
          vehicleId: blockInfo[1],
          kilometers: blockInfo[2].toString(),
          details: blockInfo[3],
          origin: blockInfo[4],
          creator: blockInfo[5],
          timestamp: new Date(Number(blockInfo[6]) * 1000).toISOString()
        });
      }
      
      return blocks;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Obtiene información de un bloque específico
   */
  async getInfoBlock(blockId) {
    try {
      if (!this.contract) {
        throw createError('Contrato no configurado correctamente', 500);
      }

      const blockInfo = await this.contract.getInfoBlock(blockId);
      
      return {
        blockId: blockInfo[0].toString(),
        vehicleId: blockInfo[1],
        kilometers: blockInfo[2].toString(),
        details: blockInfo[3],
        origin: blockInfo[4],
        creator: blockInfo[5],
        timestamp: new Date(Number(blockInfo[6]) * 1000).toISOString()
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Actualiza el estado de un vehículo
   */
  async updateVehicleStatus(vehicleId, isActive, hasValidVTV) {
    try {
      if (!this.contract) {
        throw createError('Contrato no configurado correctamente', 500);
      }

      const tx = await this.contract.updateVehicleStatus(vehicleId, isActive, hasValidVTV);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: tx.hash,
        gasUsed: receipt.gasUsed.toString(),
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Obtiene el total de bloques en el sistema
   */
  async getBlockCount() {
    try {
      if (!this.contract) {
        throw createError('Contrato no configurado correctamente', 500);
      }

      const count = await this.contract.getBlockCount();
      return count.toString();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Verifica si un bloque existe
   */
  async blockExists(blockId) {
    try {
      if (!this.contract) {
        throw createError('Contrato no configurado correctamente', 500);
      }

      const exists = await this.contract.blockExists(blockId);
      return exists;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Maneja errores del contrato
   */
  handleError(error) {
    console.error('Error en VehicleService:', error.message);
    
    if (error.code === 'CALL_EXCEPTION') {
      return createError(
        'Error al llamar función del contrato: ' + (error.reason || error.message),
        400,
        { code: error.code, reason: error.reason }
      );
    } else if (error.code === 'NETWORK_ERROR') {
      return createError(
        'Error de red al conectar con Sepolia',
        503,
        { code: error.code }
      );
    } else if (error.code === 'INSUFFICIENT_FUNDS') {
      return createError(
        'Fondos insuficientes para ejecutar la transacción',
        400,
        { code: error.code }
      );
    } else {
      return createError(
        error.message || 'Error interno del servicio de vehículos',
        500,
        { code: error.code }
      );
    }
  }
}

export default new VehicleService();