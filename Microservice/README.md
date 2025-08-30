# Sistema de Registro Vehicular en Blockchain

Este proyecto implementa un sistema descentralizado para el registro y seguimiento de información vehicular utilizando tecnología blockchain. El sistema permite registrar datos como kilometraje, detalles de mantenimiento, origen de servicios y estado de VTV (Verificación Técnica Vehicular).

## Características Principales

- **Registro Inmutable**: Toda la información vehicular se almacena de forma permanente en blockchain
- **Trazabilidad Completa**: Seguimiento del historial completo de cada vehículo
- **Verificación de Autenticidad**: Validación criptográfica de todos los registros
- **Control de Kilometraje**: Prevención de manipulación odométrica
- **Estado VTV**: Seguimiento del estado de verificación técnica vehicular

## Arquitectura del Proyecto

Este proyecto incluye:

- Contrato inteligente `VehicleInfoRegistry` para gestión de datos vehiculares
- Pruebas unitarias en Solidity usando Foundry
- Pruebas de integración en TypeScript con `viem`
- Ejemplos de uso para diferentes escenarios vehiculares
- Configuración para despliegue en múltiples redes

## Usage

### Running Tests

To run all the tests in the project, execute the following command:

```shell
npx hardhat test
```

You can also selectively run the Solidity or `node:test` tests:

```shell
npx hardhat test solidity
npx hardhat test nodejs
```

### Funcionalidades del Sistema

#### Registro de Información Vehicular
- **Crear Bloque de Información**: Registra nuevos datos vehiculares (ID, kilometraje, detalles, origen)
- **Actualizar Información**: Modifica detalles y origen manteniendo la integridad del kilometraje
- **Consultar Historial**: Accede al historial completo de cualquier vehículo
- **Verificar Existencia**: Valida la existencia de registros específicos

#### Controles de Seguridad
- **Prevención de Retroceso de Kilometraje**: El sistema impide registrar un kilometraje menor al último registrado
- **Validación de Datos**: Verificación de campos obligatorios y formatos correctos
- **Control de Acceso**: Solo el creador de un registro puede modificarlo

### Despliegue del Contrato

Para desplegar el contrato `VehicleInfoRegistry` en una red local:

```shell
npx hardhat ignition deploy ignition/modules/VehicleInfoRegistry.ts
```

Para desplegar en Sepolia, configura tu clave privada:

```shell
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
```

Luego ejecuta el despliegue:

```shell
npx hardhat ignition deploy --network sepolia ignition/modules/VehicleInfoRegistry.ts
```

## API Endpoints

### Endpoints de Bloques de la Blockchain

La API Express proporciona los siguientes endpoints para consultar información de la blockchain:

#### 1. Obtener el último bloque
```http
GET /api/blocks/latest
```

**Respuesta:**
```json
{
  "number": "0x1b4",
  "hash": "0x...",
  "parentHash": "0x...",
  "timestamp": "0x...",
  "transactions": [...]
}
```

#### 2. Obtener bloque por número o hash
```http
GET /api/blocks/:identifier
```

**Parámetros:**
- `identifier`: Número de bloque (decimal o hex) o hash del bloque

**Ejemplos:**
```bash
# Por número de bloque
curl http://localhost:3000/api/blocks/100

# Por hash
curl http://localhost:3000/api/blocks/0x1234567890abcdef...
```

#### 3. Obtener rango de bloques
```http
GET /api/blocks/range/:start/:end
```

**Parámetros:**
- `start`: Número de bloque inicial
- `end`: Número de bloque final (máximo 10 bloques)

**Ejemplo:**
```bash
curl http://localhost:3000/api/blocks/range/100/105
```

#### 4. Obtener estadísticas del último bloque
```http
GET /api/blocks/stats/latest
```

#### 5. Obtener información de la red
```http
GET /api/blocks/network/info
```

**Respuesta:**
```json
{
  "chainId": 8009,
  "latestBlock": 436,
  "gasPrice": 1000000000,
  "networkId": "8009",
  "rpcUrl": "https://devnet.zama.ai"
}
```

#### 6. Verificar estado de conexión
```http
GET /api/blocks/network/status
```

#### 7. Buscar bloques con filtros
```http
GET /api/blocks/search?startBlock=100&endBlock=200&minTxCount=5
```

**Parámetros de consulta opcionales:**
- `startBlock`: Bloque inicial para la búsqueda
- `endBlock`: Bloque final para la búsqueda
- `miner`: Dirección del minero
- `minTxCount`: Número mínimo de transacciones
- `maxTxCount`: Número máximo de transacciones

#### 8. Listar bloques con paginación
```http
GET /api/blocks?page=1&limit=10&details=true
```

**Parámetros de consulta:**
- `page`: Número de página (por defecto: 1)
- `limit`: Elementos por página (por defecto: 10, máximo: 50)
- `details`: Incluir detalles completos (por defecto: false)

### Endpoints para Contratos Inteligentes (Propuestos)

> **Nota:** Los siguientes endpoints están propuestos para interactuar con el contrato `VehicleInfoRegistry`. Actualmente, la interacción con el contrato se realiza directamente usando los ejemplos en la carpeta `examples/`.

#### 1. Crear bloque de información vehicular
```http
POST /api/vehicles/blocks
```

**Cuerpo de la solicitud:**
```json
{
  "vehicleId": "ABC123",
  "kilometros": 25000,
  "detalles": "Mantenimiento preventivo realizado",
  "origen": "Taller Mecánico XYZ",
  "privateKey": "0x..." // Clave privada para firmar la transacción
}
```

#### 2. Obtener información de un vehículo
```http
GET /api/vehicles/:vehicleId
```

**Respuesta:**
```json
{
  "vehicleId": "ABC123",
  "activo": true,
  "poseeVTV": false,
  "ultimoKilometraje": 25000,
  "existe": true
}
```

#### 3. Obtener bloques de un vehículo
```http
GET /api/vehicles/:vehicleId/blocks
```

#### 4. Actualizar estado de vehículo
```http
PUT /api/vehicles/:vehicleId/status
```

**Cuerpo de la solicitud:**
```json
{
  "activo": true,
  "poseeVTV": true,
  "privateKey": "0x..."
}
```

### Ejemplos de Uso

Consulta la carpeta `examples/` para ver casos de uso específicos:
- Registro de vehículos nuevos
- Actualización de información de mantenimiento
- Consulta de historial vehicular
- Verificación de estado VTV
