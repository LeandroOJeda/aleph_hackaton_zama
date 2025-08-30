import express from 'express';
import { asyncHandler, createError } from '../middleware/errorHandler.js';
import sepoliaService from '../services/sepoliaService.js';
import { Block, BlockCollection } from '../models/Block.js';

const router = express.Router();

/**
 * @route GET /api/blocks/latest
 * @desc Obtiene el último bloque de la blockchain
 */
router.get('/latest', asyncHandler(async (req, res) => {
  const blockData = await sepoliaService.getLatestBlock();
  
  if (!blockData) {
    throw createError('No se pudo obtener el último bloque', 404);
  }

  const block = new Block(blockData);
  
  res.json({
    success: true,
    data: block.getDetailed(),
    timestamp: new Date().toISOString()
  });
}));

/**
 * @route GET /api/blocks/:identifier
 * @desc Obtiene un bloque por número o hash
 */
router.get('/:identifier', asyncHandler(async (req, res) => {
  const { identifier } = req.params;
  let blockData;

  // Determinar si es un hash (empieza con 0x y tiene 66 caracteres) o un número
  if (identifier.startsWith('0x') && identifier.length === 66) {
    // Es un hash
    blockData = await sepoliaService.getBlockByHash(identifier);
  } else if (/^\d+$/.test(identifier) || identifier.startsWith('0x')) {
    // Es un número (decimal o hexadecimal)
    blockData = await sepoliaService.getBlockByNumber(identifier);
  } else {
    throw createError('Identificador de bloque inválido. Use un número o hash válido.', 400);
  }

  if (!blockData) {
    throw createError(`Bloque ${identifier} no encontrado`, 404);
  }

  const block = new Block(blockData);
  
  res.json({
    success: true,
    data: block.getDetailed(),
    timestamp: new Date().toISOString()
  });
}));

/**
 * @route GET /api/blocks/range/:start/:end
 * @desc Obtiene un rango de bloques
 */
router.get('/range/:start/:end', asyncHandler(async (req, res) => {
  const { start, end } = req.params;
  const limit = parseInt(req.query.limit) || 10;
  
  const startBlock = parseInt(start);
  const endBlock = parseInt(end);

  if (isNaN(startBlock) || isNaN(endBlock)) {
    throw createError('Los números de bloque deben ser válidos', 400);
  }

  if (startBlock > endBlock) {
    throw createError('El bloque inicial no puede ser mayor que el final', 400);
  }

  if (endBlock - startBlock > limit) {
    throw createError(`El rango no puede exceder ${limit} bloques`, 400);
  }

  const blocks = await sepoliaService.getBlockRange(startBlock, endBlock, limit);
  const blockCollection = new BlockCollection(blocksData);
  
  res.json({
    success: true,
    data: blockCollection.toJSON(),
    range: { start: startBlock, end: endBlock },
    timestamp: new Date().toISOString()
  });
}));

/**
 * @route GET /api/blocks/stats/latest
 * @desc Obtiene estadísticas del último bloque
 */
router.get('/stats/latest', asyncHandler(async (req, res) => {
  const blockData = await sepoliaService.getLatestBlock();
  
  if (!blockData) {
    throw createError('No se pudo obtener el último bloque', 404);
  }

  const block = new Block(blockData);
  
  res.json({
    success: true,
    data: block.getStatistics(),
    timestamp: new Date().toISOString()
  });
}));

/**
 * @route GET /api/blocks/network/info
 * @desc Obtiene información general de la red
 */
router.get('/network/info', asyncHandler(async (req, res) => {
  const networkInfo = await sepoliaService.getNetworkInfo();
  
  res.json({
    success: true,
    data: networkInfo,
    timestamp: new Date().toISOString()
  });
}));

/**
 * @route GET /api/blocks/network/status
 * @desc Verifica el estado de conexión con la red
 */
router.get('/network/status', asyncHandler(async (req, res) => {
  const connectionStatus = await sepoliaService.checkConnection();
  
  res.json({
    success: true,
    data: connectionStatus,
    timestamp: new Date().toISOString()
  });
}));

/**
 * @route GET /api/blocks/search
 * @desc Busca bloques con filtros específicos
 */
router.get('/search', asyncHandler(async (req, res) => {
  const { 
    from_block, 
    to_block, 
    miner, 
    min_transactions, 
    max_transactions,
    limit = 10 
  } = req.query;

  let startBlock = from_block ? parseInt(from_block) : null;
  let endBlock = to_block ? parseInt(to_block) : null;
  
  // Si no se especifica rango, usar los últimos bloques
  if (!startBlock || !endBlock) {
    const latestBlockNumber = await sepoliaService.getBlockNumber();
    endBlock = endBlock || latestBlockNumber;
    startBlock = startBlock || Math.max(0, endBlock - parseInt(limit) + 1);
  }

  if (endBlock - startBlock > parseInt(limit)) {
    throw createError(`El rango no puede exceder ${limit} bloques`, 400);
  }

  const blocksData = await sepoliaService.getBlockRange(startBlock, endBlock, parseInt(limit));
  let blocks = blocksData.map(blockData => new Block(blockData));

  // Aplicar filtros
  if (miner) {
    blocks = blocks.filter(block => 
      block.miner && block.miner.toLowerCase() === miner.toLowerCase()
    );
  }

  if (min_transactions) {
    blocks = blocks.filter(block => 
      block.transactions.length >= parseInt(min_transactions)
    );
  }

  if (max_transactions) {
    blocks = blocks.filter(block => 
      block.transactions.length <= parseInt(max_transactions)
    );
  }

  const blockCollection = new BlockCollection(blocks.map(b => b.toJSON()));
  
  res.json({
    success: true,
    data: blockCollection.toJSON(),
    filters: {
      from_block: startBlock,
      to_block: endBlock,
      miner,
      min_transactions,
      max_transactions
    },
    timestamp: new Date().toISOString()
  });
}));

/**
 * @route GET /api/blocks
 * @desc Lista los últimos bloques con paginación
 */
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, detailed = false } = req.query;
  
  const pageNum = parseInt(page);
  const limitNum = Math.min(parseInt(limit), 50); // Máximo 50 bloques por página
  
  if (pageNum < 1 || limitNum < 1) {
    throw createError('Los parámetros de paginación deben ser positivos', 400);
  }

  const latestBlockNumber = await sepoliaService.getBlockNumber();
  const startBlock = Math.max(0, latestBlockNumber - (pageNum * limitNum) + 1);
  const endBlock = Math.max(0, latestBlockNumber - ((pageNum - 1) * limitNum));

  if (startBlock > endBlock) {
    return res.json({
      success: true,
      data: { blocks: [], stats: null },
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: 0,
        totalPages: 0
      },
      timestamp: new Date().toISOString()
    });
  }

  const blocksData = await sepoliaService.getBlockRange(startBlock, endBlock, limitNum);
  const blocks = blocksData.map(blockData => {
    const block = new Block(blockData);
    return detailed === 'true' ? block.getDetailed() : block.getSummary();
  });

  const totalPages = Math.ceil((latestBlockNumber + 1) / limitNum);

  res.json({
    success: true,
    data: {
      blocks: blocks.reverse(), // Mostrar del más reciente al más antiguo
      latestBlock: latestBlockNumber
    },
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: latestBlockNumber + 1,
      totalPages,
      hasNext: pageNum < totalPages,
      hasPrev: pageNum > 1
    },
    timestamp: new Date().toISOString()
  });
}));

export default router;