import express from 'express';
import { asyncHandler, createError } from '../middleware/errorHandler.js';
import vehicleService from '../services/vehicleService.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     VehicleInfo:
 *       type: object
 *       properties:
 *         vehicleId:
 *           type: string
 *           description: ID único del vehículo
 *         isActive:
 *           type: boolean
 *           description: Estado activo del vehículo
 *         hasValidVTV:
 *           type: boolean
 *           description: Estado de la verificación técnica vehicular
 *         lastKilometers:
 *           type: string
 *           description: Último kilometraje registrado
 *         isRegistered:
 *           type: boolean
 *           description: Si el vehículo está registrado en el sistema
 *     InfoBlock:
 *       type: object
 *       properties:
 *         blockId:
 *           type: string
 *           description: ID único del bloque
 *         vehicleId:
 *           type: string
 *           description: ID del vehículo
 *         kilometers:
 *           type: string
 *           description: Kilometraje registrado
 *         details:
 *           type: string
 *           description: Detalles del servicio o evento
 *         origin:
 *           type: string
 *           description: Origen del registro (taller, aseguradora, etc.)
 *         creator:
 *           type: string
 *           description: Dirección del creador del registro
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora del registro
 *     CreateBlockRequest:
 *       type: object
 *       required:
 *         - vehicleId
 *         - kilometers
 *         - details
 *         - origin
 *       properties:
 *         vehicleId:
 *           type: string
 *           description: ID único del vehículo
 *         kilometers:
 *           type: integer
 *           minimum: 0
 *           description: Kilometraje actual del vehículo
 *         details:
 *           type: string
 *           description: Descripción detallada del servicio o evento
 *         origin:
 *           type: string
 *           description: Origen del registro (ej. "Taller Mecánico XYZ")
 *     UpdateStatusRequest:
 *       type: object
 *       required:
 *         - isActive
 *         - hasValidVTV
 *       properties:
 *         isActive:
 *           type: boolean
 *           description: Estado activo del vehículo
 *         hasValidVTV:
 *           type: boolean
 *           description: Estado de la verificación técnica vehicular
 */

/**
 * @swagger
 * /api/vehicles/{vehicleId}/info:
 *   get:
 *     summary: Obtiene información general de un vehículo
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único del vehículo
 *     responses:
 *       200:
 *         description: Información del vehículo obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/VehicleInfo'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Vehículo no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:vehicleId/info', asyncHandler(async (req, res) => {
  const { vehicleId } = req.params;
  
  if (!vehicleId) {
    throw createError('ID de vehículo requerido', 400);
  }

  const vehicleInfo = await vehicleService.getVehicleInfo(vehicleId);
  
  res.json({
    success: true,
    data: vehicleInfo,
    timestamp: new Date().toISOString()
  });
}));

/**
 * @swagger
 * /api/vehicles/{vehicleId}/blocks:
 *   get:
 *     summary: Obtiene todos los bloques de información de un vehículo
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único del vehículo
 *     responses:
 *       200:
 *         description: Bloques del vehículo obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/InfoBlock'
 *                 count:
 *                   type: integer
 *                   description: Número total de bloques
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Vehículo no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:vehicleId/blocks', asyncHandler(async (req, res) => {
  const { vehicleId } = req.params;
  
  if (!vehicleId) {
    throw createError('ID de vehículo requerido', 400);
  }

  const blocks = await vehicleService.getVehicleBlocks(vehicleId);
  
  res.json({
    success: true,
    data: blocks,
    count: blocks.length,
    timestamp: new Date().toISOString()
  });
}));

/**
 * @swagger
 * /api/vehicles/blocks:
 *   post:
 *     summary: Crea un nuevo bloque de información vehicular
 *     tags: [Vehicles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBlockRequest'
 *     responses:
 *       201:
 *         description: Bloque creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     transactionHash:
 *                       type: string
 *                       description: Hash de la transacción
 *                     blockId:
 *                       type: string
 *                       description: ID del bloque creado
 *                     gasUsed:
 *                       type: string
 *                       description: Gas utilizado en la transacción
 *                     blockNumber:
 *                       type: integer
 *                       description: Número del bloque en la blockchain
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/blocks', asyncHandler(async (req, res) => {
  const { vehicleId, kilometers, details, origin } = req.body;
  
  // Validaciones
  if (!vehicleId || !kilometers || !details || !origin) {
    throw createError('Todos los campos son requeridos: vehicleId, kilometers, details, origin', 400);
  }
  
  if (typeof kilometers !== 'number' || kilometers < 0) {
    throw createError('Los kilómetros deben ser un número positivo', 400);
  }
  
  if (typeof details !== 'string' || details.trim().length === 0) {
    throw createError('Los detalles deben ser una cadena no vacía', 400);
  }
  
  if (typeof origin !== 'string' || origin.trim().length === 0) {
    throw createError('El origen debe ser una cadena no vacía', 400);
  }

  const result = await vehicleService.createInfoBlock(vehicleId, kilometers, details, origin);
  
  res.status(201).json({
    success: true,
    data: result,
    timestamp: new Date().toISOString()
  });
}));

/**
 * @swagger
 * /api/vehicles/blocks/{blockId}:
 *   get:
 *     summary: Obtiene información de un bloque específico
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: blockId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único del bloque
 *     responses:
 *       200:
 *         description: Información del bloque obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/InfoBlock'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Bloque no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/blocks/:blockId', asyncHandler(async (req, res) => {
  const { blockId } = req.params;
  
  if (!blockId) {
    throw createError('ID de bloque requerido', 400);
  }

  const blockInfo = await vehicleService.getInfoBlock(blockId);
  
  res.json({
    success: true,
    data: blockInfo,
    timestamp: new Date().toISOString()
  });
}));

/**
 * @swagger
 * /api/vehicles/{vehicleId}/status:
 *   put:
 *     summary: Actualiza el estado de un vehículo
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único del vehículo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStatusRequest'
 *     responses:
 *       200:
 *         description: Estado del vehículo actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     transactionHash:
 *                       type: string
 *                       description: Hash de la transacción
 *                     gasUsed:
 *                       type: string
 *                       description: Gas utilizado en la transacción
 *                     blockNumber:
 *                       type: integer
 *                       description: Número del bloque en la blockchain
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Vehículo no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:vehicleId/status', asyncHandler(async (req, res) => {
  const { vehicleId } = req.params;
  const { isActive, hasValidVTV } = req.body;
  
  if (!vehicleId) {
    throw createError('ID de vehículo requerido', 400);
  }
  
  if (typeof isActive !== 'boolean' || typeof hasValidVTV !== 'boolean') {
    throw createError('isActive y hasValidVTV deben ser valores booleanos', 400);
  }

  const result = await vehicleService.updateVehicleStatus(vehicleId, isActive, hasValidVTV);
  
  res.json({
    success: true,
    data: result,
    timestamp: new Date().toISOString()
  });
}));

/**
 * @swagger
 * /api/vehicles/stats/total-blocks:
 *   get:
 *     summary: Obtiene el número total de bloques en el sistema
 *     tags: [Vehicles]
 *     responses:
 *       200:
 *         description: Número total de bloques obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalBlocks:
 *                       type: string
 *                       description: Número total de bloques en el sistema
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       500:
 *         description: Error interno del servidor
 */
router.get('/stats/total-blocks', asyncHandler(async (req, res) => {
  const totalBlocks = await vehicleService.getBlockCount();
  
  res.json({
    success: true,
    data: {
      totalBlocks: totalBlocks
    },
    timestamp: new Date().toISOString()
  });
}));

/**
 * @swagger
 * /api/vehicles/blocks/{blockId}/exists:
 *   get:
 *     summary: Verifica si un bloque existe
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: blockId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único del bloque
 *     responses:
 *       200:
 *         description: Verificación completada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     exists:
 *                       type: boolean
 *                       description: Si el bloque existe o no
 *                     blockId:
 *                       type: string
 *                       description: ID del bloque verificado
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: ID de bloque inválido
 *       500:
 *         description: Error interno del servidor
 */
router.get('/blocks/:blockId/exists', asyncHandler(async (req, res) => {
  const { blockId } = req.params;
  
  if (!blockId) {
    throw createError('ID de bloque requerido', 400);
  }

  const exists = await vehicleService.blockExists(blockId);
  
  res.json({
    success: true,
    data: {
      exists: exists,
      blockId: blockId
    },
    timestamp: new Date().toISOString()
  });
}));

export default router;