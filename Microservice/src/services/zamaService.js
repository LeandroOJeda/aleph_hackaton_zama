const axios = require('axios');
const { createError } = require('../middleware/errorHandler');

class ZamaService {
  constructor() {
    this.rpcUrl = process.env.ZAMA_RPC_URL || 'https://devnet.zama.ai';
    this.networkId = process.env.ZAMA_NETWORK_ID || '8009';
    this.apiKey = process.env.ZAMA_API_KEY;
    
    // Configurar cliente HTTP
    this.client = axios.create({
      baseURL: this.rpcUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
      }
    });

    // Interceptor para manejo de errores
    this.client.interceptors.response.use(
      response => response,
      error => {
        console.error('Error en solicitud a Zama:', error.message);
        throw this.handleError(error);
      }
    );
  }

  /**
   * Maneja errores de la API de Zama
   */
  handleError(error) {
    if (error.response) {
      // Error de respuesta del servidor
      const { status, data } = error.response;
      return createError(
        data.message || `Error ${status} de la red Zama`,
        status,
        data
      );
    } else if (error.request) {
      // Error de red
      return createError(
        'No se pudo conectar con la red Zama',
        503,
        { code: error.code }
      );
    } else {
      // Error de configuración
      return createError(
        'Error en la configuración de la solicitud',
        500,
        { message: error.message }
      );
    }
  }

  /**
   * Realiza una llamada RPC a la red Zama
   */
  async rpcCall(method, params = []) {
    try {
      const payload = {
        jsonrpc: '2.0',
        method,
        params,
        id: Date.now()
      };

      const response = await this.client.post('/', payload);
      
      if (response.data.error) {
        throw createError(
          response.data.error.message || 'Error en llamada RPC',
          400,
          response.data.error
        );
      }

      return response.data.result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtiene información del último bloque
   */
  async getLatestBlock() {
    return await this.rpcCall('eth_getBlockByNumber', ['latest', true]);
  }

  /**
   * Obtiene un bloque por su número
   */
  async getBlockByNumber(blockNumber) {
    const hexBlockNumber = typeof blockNumber === 'number' 
      ? `0x${blockNumber.toString(16)}` 
      : blockNumber;
    
    return await this.rpcCall('eth_getBlockByNumber', [hexBlockNumber, true]);
  }

  /**
   * Obtiene un bloque por su hash
   */
  async getBlockByHash(blockHash) {
    return await this.rpcCall('eth_getBlockByHash', [blockHash, true]);
  }

  /**
   * Obtiene el número del último bloque
   */
  async getBlockNumber() {
    const result = await this.rpcCall('eth_blockNumber');
    return parseInt(result, 16);
  }

  /**
   * Obtiene información de la red
   */
  async getNetworkInfo() {
    try {
      const [chainId, blockNumber, gasPrice] = await Promise.all([
        this.rpcCall('eth_chainId'),
        this.rpcCall('eth_blockNumber'),
        this.rpcCall('eth_gasPrice')
      ]);

      return {
        chainId: parseInt(chainId, 16),
        latestBlock: parseInt(blockNumber, 16),
        gasPrice: parseInt(gasPrice, 16),
        networkId: this.networkId,
        rpcUrl: this.rpcUrl
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtiene múltiples bloques en un rango
   */
  async getBlockRange(startBlock, endBlock, limit = 10) {
    if (endBlock - startBlock > limit) {
      throw createError(
        `El rango de bloques no puede exceder ${limit} bloques`,
        400
      );
    }

    const promises = [];
    for (let i = startBlock; i <= endBlock; i++) {
      promises.push(this.getBlockByNumber(i));
    }

    return await Promise.all(promises);
  }

  /**
   * Verifica la conectividad con la red
   */
  async checkConnection() {
    try {
      await this.rpcCall('eth_blockNumber');
      return { connected: true, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        connected: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

module.exports = new ZamaService();