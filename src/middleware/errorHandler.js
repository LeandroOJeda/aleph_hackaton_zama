/**
 * Middleware para manejo centralizado de errores
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Error de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Error de validación',
      message: err.message,
      details: err.details || null
    });
  }

  // Error de conexión a la red
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    return res.status(503).json({
      error: 'Error de conexión',
      message: 'No se pudo conectar con la red Zama',
      code: err.code
    });
  }

  // Error de timeout
  if (err.code === 'ECONNABORTED') {
    return res.status(408).json({
      error: 'Timeout',
      message: 'La solicitud tardó demasiado tiempo en responder'
    });
  }

  // Error de autenticación
  if (err.status === 401) {
    return res.status(401).json({
      error: 'No autorizado',
      message: 'Credenciales inválidas o faltantes'
    });
  }

  // Error de recurso no encontrado
  if (err.status === 404) {
    return res.status(404).json({
      error: 'Recurso no encontrado',
      message: err.message || 'El recurso solicitado no existe'
    });
  }

  // Error genérico del servidor
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({
    error: 'Error del servidor',
    message: process.env.NODE_ENV === 'development' ? message : 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * Middleware para capturar errores asíncronos
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Crear error personalizado
 */
const createError = (message, statusCode = 500, details = null) => {
  const error = new Error(message);
  error.status = statusCode;
  error.details = details;
  return error;
};

module.exports = {
  errorHandler,
  asyncHandler,
  createError
};