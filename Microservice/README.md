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

### Ejemplos de Uso

Consulta la carpeta `examples/` para ver casos de uso específicos:
- Registro de vehículos nuevos
- Actualización de información de mantenimiento
- Consulta de historial vehicular
- Verificación de estado VTV
