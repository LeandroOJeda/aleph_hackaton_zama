/**
 * Modelo de datos para bloques de la blockchain
 */
class Block {
  constructor(blockData) {
    this.number = blockData.number ? parseInt(blockData.number, 16) : null;
    this.hash = blockData.hash;
    this.parentHash = blockData.parentHash;
    this.nonce = blockData.nonce;
    this.sha3Uncles = blockData.sha3Uncles;
    this.logsBloom = blockData.logsBloom;
    this.transactionsRoot = blockData.transactionsRoot;
    this.stateRoot = blockData.stateRoot;
    this.receiptsRoot = blockData.receiptsRoot;
    this.miner = blockData.miner;
    this.difficulty = blockData.difficulty ? parseInt(blockData.difficulty, 16) : null;
    this.totalDifficulty = blockData.totalDifficulty ? parseInt(blockData.totalDifficulty, 16) : null;
    this.extraData = blockData.extraData;
    this.size = blockData.size ? parseInt(blockData.size, 16) : null;
    this.gasLimit = blockData.gasLimit ? parseInt(blockData.gasLimit, 16) : null;
    this.gasUsed = blockData.gasUsed ? parseInt(blockData.gasUsed, 16) : null;
    this.timestamp = blockData.timestamp ? parseInt(blockData.timestamp, 16) : null;
    this.transactions = blockData.transactions || [];
    this.uncles = blockData.uncles || [];
  }

  /**
   * Convierte el timestamp a fecha legible
   */
  getFormattedTimestamp() {
    if (!this.timestamp) return null;
    return new Date(this.timestamp * 1000).toISOString();
  }

  /**
   * Obtiene información resumida del bloque
   */
  getSummary() {
    return {
      number: this.number,
      hash: this.hash,
      parentHash: this.parentHash,
      miner: this.miner,
      timestamp: this.getFormattedTimestamp(),
      transactionCount: this.transactions.length,
      gasUsed: this.gasUsed,
      gasLimit: this.gasLimit,
      size: this.size
    };
  }

  /**
   * Obtiene información detallada del bloque
   */
  getDetailed() {
    return {
      ...this.getSummary(),
      difficulty: this.difficulty,
      totalDifficulty: this.totalDifficulty,
      nonce: this.nonce,
      sha3Uncles: this.sha3Uncles,
      logsBloom: this.logsBloom,
      transactionsRoot: this.transactionsRoot,
      stateRoot: this.stateRoot,
      receiptsRoot: this.receiptsRoot,
      extraData: this.extraData,
      uncles: this.uncles,
      transactions: this.transactions.map(tx => {
        if (typeof tx === 'string') {
          return tx; // Solo hash de transacción
        }
        return {
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: tx.value ? parseInt(tx.value, 16) : 0,
          gas: tx.gas ? parseInt(tx.gas, 16) : 0,
          gasPrice: tx.gasPrice ? parseInt(tx.gasPrice, 16) : 0,
          nonce: tx.nonce ? parseInt(tx.nonce, 16) : 0
        };
      })
    };
  }

  /**
   * Valida si el bloque tiene la estructura correcta
   */
  isValid() {
    return !!(this.hash && this.number !== null && this.timestamp);
  }

  /**
   * Calcula estadísticas del bloque
   */
  getStatistics() {
    const totalGasUsed = this.gasUsed || 0;
    const totalGasLimit = this.gasLimit || 0;
    const gasUtilization = totalGasLimit > 0 ? (totalGasUsed / totalGasLimit) * 100 : 0;

    return {
      transactionCount: this.transactions.length,
      gasUtilization: Math.round(gasUtilization * 100) / 100,
      gasUsed: totalGasUsed,
      gasLimit: totalGasLimit,
      blockSize: this.size || 0,
      timestamp: this.getFormattedTimestamp()
    };
  }

  /**
   * Convierte el bloque a JSON
   */
  toJSON() {
    return this.getDetailed();
  }
}

/**
 * Clase para manejar colecciones de bloques
 */
class BlockCollection {
  constructor(blocks = []) {
    this.blocks = blocks.map(block => new Block(block));
  }

  /**
   * Añade un bloque a la colección
   */
  addBlock(blockData) {
    const block = new Block(blockData);
    if (block.isValid()) {
      this.blocks.push(block);
      return true;
    }
    return false;
  }

  /**
   * Obtiene bloques ordenados por número
   */
  getSorted(ascending = false) {
    return this.blocks.sort((a, b) => {
      const comparison = a.number - b.number;
      return ascending ? comparison : -comparison;
    });
  }

  /**
   * Filtra bloques por rango de tiempo
   */
  filterByTimeRange(startTime, endTime) {
    return this.blocks.filter(block => {
      const blockTime = block.timestamp;
      return blockTime >= startTime && blockTime <= endTime;
    });
  }

  /**
   * Obtiene estadísticas de la colección
   */
  getCollectionStats() {
    if (this.blocks.length === 0) {
      return {
        totalBlocks: 0,
        averageGasUsed: 0,
        totalTransactions: 0,
        averageBlockSize: 0
      };
    }

    const totalGasUsed = this.blocks.reduce((sum, block) => sum + (block.gasUsed || 0), 0);
    const totalTransactions = this.blocks.reduce((sum, block) => sum + block.transactions.length, 0);
    const totalSize = this.blocks.reduce((sum, block) => sum + (block.size || 0), 0);

    return {
      totalBlocks: this.blocks.length,
      averageGasUsed: Math.round(totalGasUsed / this.blocks.length),
      totalTransactions,
      averageTransactionsPerBlock: Math.round(totalTransactions / this.blocks.length * 100) / 100,
      averageBlockSize: Math.round(totalSize / this.blocks.length),
      blockRange: {
        from: Math.min(...this.blocks.map(b => b.number)),
        to: Math.max(...this.blocks.map(b => b.number))
      }
    };
  }

  /**
   * Convierte la colección a JSON
   */
  toJSON() {
    return {
      blocks: this.blocks.map(block => block.getSummary()),
      stats: this.getCollectionStats()
    };
  }
}

module.exports = {
  Block,
  BlockCollection
};