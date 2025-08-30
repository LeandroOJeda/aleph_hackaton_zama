# Zama Blockchain Microservice

Microservicio para interactuar con la red blockchain Zama y obtener información de bloques.

## Características

- 🔗 Conexión con la red Zama
- 📦 Endpoints para obtener información de bloques
- 🛡️ Manejo de errores robusto
- 🚀 Rate limiting y seguridad
- 📊 Estadísticas de bloques
- 🔍 Búsqueda y filtrado de bloques
- 📄 Paginación de resultados

## Instalación

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno en el archivo `.env`
4. Inicia el servidor:
   ```bash
   npm start
   ```
   O para desarrollo:
   ```bash
   npm run dev
   ```

## Configuración

Crea un archivo `.env` con las siguientes variables:

```env
PORT=3000
NODE_ENV=development
ZAMA_RPC_URL=https://devnet.zama.ai
ZAMA_NETWORK_ID=8009
ZAMA_API_KEY=your_api_key_here
```

## Endpoints de la API

### Información General

- `GET /` - Información básica de la API
- `GET /health` - Health check del servicio

### Bloques

- `GET /api/blocks` - Lista los últimos bloques (con paginación)
- `GET /api/blocks/latest` - Obtiene el último bloque
- `GET /api/blocks/:identifier` - Obtiene un bloque por número o hash
- `GET /api/blocks/range/:start/:end` - Obtiene un rango de bloques
- `GET /api/blocks/search` - Busca bloques con filtros

### Estadísticas

- `GET /api/blocks/stats/latest` - Estadísticas del último bloque
- `GET /api/blocks/network/info` - Información de la red
- `GET /api/blocks/network/status` - Estado de conexión

## Ejemplos de Uso

### Obtener el último bloque
```bash
curl http://localhost:3000/api/blocks/latest
```

### Obtener un bloque específico
```bash
# Por número
curl http://localhost:3000/api/blocks/12345

# Por hash
curl http://localhost:3000/api/blocks/0x1234567890abcdef...
```

### Obtener rango de bloques
```bash
curl http://localhost:3000/api/blocks/range/100/110
```

### Buscar bloques con filtros
```bash
curl "http://localhost:3000/api/blocks/search?min_transactions=5&limit=20"
```

### Listar bloques con paginación
```bash
curl "http://localhost:3000/api/blocks?page=1&limit=10&detailed=true"
```

## Estructura del Proyecto

```
src/
├── index.js              # Punto de entrada del servidor
├── middleware/
│   └── errorHandler.js   # Middleware de manejo de errores
├── models/
│   └── Block.js          # Modelos de datos para bloques
├── routes/
│   └── blocks.js         # Rutas de la API de bloques
└── services/
    └── zamaService.js    # Servicio para interactuar con Zama
```

## Respuestas de la API

Todas las respuestas siguen el formato:

```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

En caso de error:

```json
{
  "error": "Tipo de error",
  "message": "Descripción del error",
  "details": { ... }
}
```

## Seguridad

- Rate limiting: 100 requests por 15 minutos por IP
- Helmet.js para headers de seguridad
- CORS habilitado
- Validación de parámetros de entrada
- Manejo seguro de errores

## Desarrollo

### Scripts disponibles

- `npm start` - Inicia el servidor en producción
- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon
- `npm test` - Ejecuta las pruebas

### Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## Licencia

MIT