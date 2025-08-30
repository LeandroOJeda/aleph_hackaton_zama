import { ethers } from 'ethers';
import { createError } from '../middleware/errorHandler.js';

class SepoliaService {
  constructor() {
    this.rpcUrl = process.env.SEPOLIA_RPC_URL || 'https://mainnet.infura.io/v3/c448524db0c94a30a49343ccda43d374';
    this.privateKey = process.env.SEPOLIA_PRIVATE_KEY;
    this.chainId = 11155111;
    
    // Configurar provider
    this.provider = new ethers.JsonRpcProvider(this.rpcUrl);
    
    // Configurar wallet si hay clave privada
    if (this.privateKey) {
      this.wallet = new ethers.Wallet(this.privateKey, this.provider);
    }
  }

  /**
   * Obtiene el último bloque de la blockchain
   */
  async getLatestBlock() {
    try {
      const block = await this.provider.getBlock('latest', true);
      return this.formatBlock(block);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Obtiene un bloque por número
   */
  async getBlockByNumber(blockNumber) {
    try {
      const block = await this.provider.getBlock(blockNumber, true);
      if (!block) {
        throw createError('Bloque no encontrado', 404);
      }
      return this.formatBlock(block);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Obtiene un bloque por hash
   */
  async getBlockByHash(blockHash) {
    try {
      const block = await this.provider.getBlock(blockHash, true);
      if (!block) {
        throw createError('Bloque no encontrado', 404);
      }
      return this.formatBlock(block);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Obtiene el número del último bloque
   */
  async getBlockNumber() {
    try {
      return await this.provider.getBlockNumber();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Obtiene información de la red
   */
  async getNetworkInfo() {
    try {
      const [network, blockNumber, gasPrice] = await Promise.all([
        this.provider.getNetwork(),
        this.provider.getBlockNumber(),
        this.provider.getFeeData()
      ]);

      return {
        chainId: Number(network.chainId),
        name: network.name,
        latestBlock: blockNumber,
        gasPrice: gasPrice.gasPrice ? Number(gasPrice.gasPrice) : null,
        maxFeePerGas: gasPrice.maxFeePerGas ? Number(gasPrice.maxFeePerGas) : null,
        maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas ? Number(gasPrice.maxPriorityFeePerGas) : null,
        rpcUrl: this.rpcUrl
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Obtiene un rango de bloques
   */
  async getBlockRange(startBlock, endBlock, limit = 10) {
    try {
      const actualLimit = Math.min(limit, 10);
      const actualEnd = Math.min(endBlock, startBlock + actualLimit - 1);
      
      const blocks = [];
      for (let i = startBlock; i <= actualEnd; i++) {
        const block = await this.provider.getBlock(i, true);
        if (block) {
          blocks.push(this.formatBlock(block));
        }
      }
      
      return blocks;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Verifica el estado de conexión
   */
  async checkConnection() {
    try {
      const blockNumber = await this.provider.getBlockNumber();
      return {
        connected: true,
        latestBlock: blockNumber,
        rpcUrl: this.rpcUrl,
        chainId: this.chainId
      };
    } catch (error) {
      return {
        connected: false,
        error: error.message,
        rpcUrl: this.rpcUrl,
        chainId: this.chainId
      };
    }
  }

  /**
   * Formatea un bloque para la respuesta
   */
  formatBlock(block) {
    return {
      number: block.number,
      hash: block.hash,
      parentHash: block.parentHash,
      nonce: block.nonce,
      sha3Uncles: block.sha3Uncles,
      logsBloom: block.logsBloom,
      transactionsRoot: block.transactionsRoot,
      stateRoot: block.stateRoot,
      receiptsRoot: block.receiptsRoot,
      miner: block.miner,
      difficulty: block.difficulty ? Number(block.difficulty) : null,
      totalDifficulty: block.totalDifficulty ? Number(block.totalDifficulty) : null,
      extraData: block.extraData,
      size: block.size,
      gasLimit: block.gasLimit ? Number(block.gasLimit) : null,
      gasUsed: block.gasUsed ? Number(block.gasUsed) : null,
      timestamp: block.timestamp,
      transactions: block.transactions || [],
      uncles: block.uncles || []
    };
  }

  /**
   * Maneja errores de la conexión
   */
  handleError(error) {
    console.error('Error en SepoliaService:', error.message);
    
    if (error.code === 'NETWORK_ERROR') {
      return createError(
        'No se pudo conectar con la red Sepolia',
        503,
        { code: error.code }
      );
    } else if (error.code === 'INVALID_ARGUMENT') {
      return createError(
        'Parámetros inválidos en la solicitud',
        400,
        { code: error.code }
      );
    } else {
      return createError(
        error.message || 'Error interno del servicio',
        500,
        { code: error.code }
      );
    }
  }
}

export default new SepoliaService();