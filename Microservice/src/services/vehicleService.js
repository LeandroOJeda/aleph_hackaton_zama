import { ethers } from 'ethers';
import { createError } from '../middleware/errorHandler.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createInstance } from 'fhevmjs';

// Asegurar que las variables de entorno estén cargadas
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
    
    // Inicializar FHEVM instance
    this.initializeFHEVM();
    
    // Cargar ABI del contrato
    this.loadContractABI();
  }

  async initializeFHEVM() {
    try {
      // Para desarrollo en backend, usar una implementación mock
      // En producción, la encriptación se haría en el frontend
      this.fhevmInstance = {
        encrypt32: (value) => {
           // Para el mock, convertir el valor a bytes32 como espera el ABI
           // En producción real, esto sería un tipo euint32 encriptado de Zama
           return ethers.zeroPadValue(ethers.toBeHex(value), 32);
         },
         encryptBool: (value) => {
           // Para el mock, convertir el booleano a bytes32 como espera el ABI
           // En producción real, esto sería un tipo ebool encriptado de Zama
           return ethers.zeroPadValue(ethers.toBeHex(value ? 1 : 0), 32);
         }
      };
      console.log('FHEVM mock instance initialized for development');
    } catch (error) {
      console.error('Error initializing FHEVM:', error.message);
      throw createError('Error inicializando FHEVM', 500);
    }
  }

  /**
   * Carga el ABI del contrato desde el archivo de artifacts
   */
  loadContractABI() {
    try {
      console.log('Configuración del contrato:');
      console.log('- Contract Address:', this.contractAddress);
      console.log('- Private Key exists:', !!this.privateKey);
      console.log('- Wallet exists:', !!this.wallet);
      
      const artifactPath = path.join(__dirname, '../../artifacts/contracts/TransactionRegistry.sol/VehicleInfoRegistry.json');
      const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
      this.contractABI = artifact.abi;
      console.log('- ABI cargado correctamente');
      
      // Crear instancia del contrato si tenemos la dirección
      if (this.contractAddress && this.wallet) {
        this.contract = new ethers.Contract(this.contractAddress, this.contractABI, this.wallet);
        console.log('- Contrato inicializado correctamente');
      } else {
        console.log('- Error: Falta contractAddress o wallet para inicializar el contrato');
      }
    } catch (error) {
      console.error('Error cargando ABI del contrato:', error.message);
    }
  }

  /**
   * Crea un nuevo bloque de información para un vehículo
   * NOTA: En producción, los datos deberían venir encriptados desde el frontend usando fhevmjs
   */
  async createInfoBlock(vehicleId, kilometers, details, origin) {
    try {
      if (!this.contract) {
        throw createError('Contrato no configurado correctamente', 500);
      }

      // Validaciones de entrada
      if (!vehicleId || typeof vehicleId !== 'string') {
        throw createError('vehicleId debe ser una cadena válida', 400);
      }
      
      if (!details || typeof details !== 'string') {
        throw createError('details debe ser una cadena válida', 400);
      }
      
      if (!origin || typeof origin !== 'string') {
        throw createError('origin debe ser una cadena válida', 400);
      }

      // Convertir kilometers a uint32
      const kilometersUint32 = parseInt(kilometers);
      if (isNaN(kilometersUint32) || kilometersUint32 < 0) {
        throw createError('kilometers debe ser un número positivo', 400);
      }
      
      // Encriptar los kilómetros usando FHEVM
      if (!this.fhevmInstance) {
        throw createError('FHEVM instance no inicializada', 500);
      }
      
      const encryptedKilometers = this.fhevmInstance.encrypt32(kilometersUint32);
      
      // Configuración de gas específica para FHEVM
      const gasOptions = {
        gasLimit: 2000000, // Gas limit para operaciones FHEVM
        gasPrice: ethers.parseUnits('10', 'gwei') // Gas price para Sepolia
      };
      
      console.log('Datos encriptados:', {
        vehicleId,
        encryptedKilometers,
        details,
        origin
      });
      
      const tx = await this.contract.createInfoBlock(
        vehicleId,
        encryptedKilometers,
        details,
        origin
      );
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

      // Validaciones de entrada
      if (!vehicleId || typeof vehicleId !== 'string') {
        throw createError('vehicleId debe ser una cadena válida', 400);
      }
      
      if (typeof isActive !== 'boolean') {
        throw createError('isActive debe ser un valor booleano', 400);
      }
      
      if (typeof hasValidVTV !== 'boolean') {
        throw createError('hasValidVTV debe ser un valor booleano', 400);
      }

      // Encriptar los valores booleanos
      if (!this.fhevmInstance) {
        throw createError('FHEVM instance no inicializada', 500);
      }
      
      const encryptedIsActive = this.fhevmInstance.encryptBool(isActive);
      const encryptedHasValidVTV = this.fhevmInstance.encryptBool(hasValidVTV);
      
      // Configuración de gas específica para FHEVM
      const gasOptions = {
        gasLimit: 2000000,
        gasPrice: ethers.parseUnits('10', 'gwei')
      };

      const tx = await this.contract.updateVehicleStatus(
        vehicleId,
        encryptedIsActive,
        encryptedHasValidVTV
      );
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
   * Maneja errores del contrato siguiendo principios de Clean Code
   */
  handleError(error) {
    console.error('Error en VehicleService:', {
      message: error.message,
      code: error.code,
      reason: error.reason,
      stack: error.stack
    });
    
    // Mapeo de errores específicos de FHEVM y Ethereum
    const errorMappings = {
      'CALL_EXCEPTION': {
        message: `Error al ejecutar función del contrato: ${error.reason || error.message}`,
        status: 400
      },
      'NETWORK_ERROR': {
        message: 'Error de conexión con la red Sepolia. Verifique su conectividad.',
        status: 503
      },
      'INSUFFICIENT_FUNDS': {
        message: 'Fondos insuficientes para ejecutar la transacción. Verifique su balance.',
        status: 400
      },
      'UNPREDICTABLE_GAS_LIMIT': {
        message: 'No se pudo estimar el gas necesario. Verifique los parámetros de la transacción.',
        status: 400
      },
      'REPLACEMENT_UNDERPRICED': {
        message: 'El precio del gas es muy bajo. Intente con un precio mayor.',
        status: 400
      },
      'NONCE_EXPIRED': {
        message: 'La transacción ha expirado. Intente nuevamente.',
        status: 400
      }
    };
    
    const errorMapping = errorMappings[error.code];
    
    if (errorMapping) {
      return createError(
        errorMapping.message,
        errorMapping.status,
        { 
          code: error.code, 
          reason: error.reason,
          originalMessage: error.message
        }
      );
    }
    
    // Error genérico
    return createError(
      error.message || 'Error interno del servicio de vehículos',
      500,
      { 
        code: error.code || 'UNKNOWN_ERROR',
        originalMessage: error.message
      }
    );
  }
}

export default new VehicleService();