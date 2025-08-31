// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32, ebool, externalEuint32, externalEbool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract VehicleInfoRegistry is SepoliaConfig {
    // Estructura genérica para bloques de información vehicular
    struct InfoBlock {
        euint32 id;
        string vehicleId; // Identificador del vehículo
        euint32 kilometros; // Kilómetros al momento del registro
        string detalles; // Campo de texto libre para detalles
        string origen; // Usuario/entidad que creó el bloque
        address createdBy; // Dirección que creó el registro
        euint32 timestamp; // Momento de creación (usar euint32 en lugar de euint64)
    }
    
    // Información adicional por vehículo
    struct VehicleInfo {
        ebool activo; // Estado activo/inactivo
        ebool poseeVTV; // Posee Verificación Técnica Vehicular
        euint32 ultimoKilometraje; // Último kilometraje registrado
        ebool existe; // Para verificar si el vehículo está registrado
    }

    mapping(euint32 => InfoBlock) private infoBlocks;
    mapping(string => euint32[]) private vehicleBlocks; // vehicleId => block IDs
    mapping(address => euint32[]) private userBlocks;
    mapping(string => VehicleInfo) private vehicles; // vehicleId => vehicle info
    euint32 private nextId;

    event InfoBlockCreated(
        euint32 indexed id,
        string indexed vehicleId,
        address indexed createdBy
    );

    event VehicleStatusUpdated(
        string indexed vehicleId,
        address indexed updatedBy
    );

    event KilometrajeUpdated(
        string indexed vehicleId,
        address indexed updatedBy
    );

    constructor() {
        nextId = FHE.asEuint32(1);
    }

    function getBlockCount() public view returns (euint32) {
        return nextId;
    }

    function createInfoBlock(
        string memory _vehicleId,
        euint32 encryptedKilometros,
        string memory _detalles,
        string memory _origen
    ) public returns (euint32) {
        require(bytes(_vehicleId).length > 0, "El ID del vehiculo no puede estar vacio");
        require(bytes(_detalles).length > 0, "Los detalles no pueden estar vacios");
        require(bytes(_origen).length > 0, "El origen no puede estar vacio");
        
        // Usar directamente el parámetro encriptado
        euint32 kilometros = encryptedKilometros;
        
        // En FHEVM v0.4+, no podemos usar decrypt en require statements
        // Las validaciones se hacen completamente encriptadas

        euint32 blockId = nextId;
        nextId = FHE.add(nextId, FHE.asEuint32(1));

        // Usar timestamp relativo para evitar overflow de uint32
        // Restar una fecha base (1 enero 2024) para reducir el valor
        uint256 baseTimestamp = 1704067200; // 1 enero 2024 en Unix timestamp
        uint32 relativeTimestamp = uint32(block.timestamp - baseTimestamp);
        
        infoBlocks[blockId] = InfoBlock({
            id: blockId,
            vehicleId: _vehicleId,
            kilometros: kilometros,
            detalles: _detalles,
            origen: _origen,
            createdBy: msg.sender,
            timestamp: FHE.asEuint32(relativeTimestamp)
        });

        vehicleBlocks[_vehicleId].push(blockId);
        userBlocks[msg.sender].push(blockId);

        // Actualizar información del vehículo
        VehicleInfo storage vehicleInfo = vehicles[_vehicleId];
        
        // En FHEVM v0.4+, usamos operaciones completamente encriptadas
        // Si el vehículo no existe, lo creamos. Si existe, actualizamos el kilometraje
        ebool vehicleExists = vehicleInfo.existe;
        
        // Crear o actualizar vehículo usando operaciones FHE
        vehicleInfo.activo = FHE.select(vehicleExists, vehicleInfo.activo, FHE.asEbool(true));
        vehicleInfo.poseeVTV = FHE.select(vehicleExists, vehicleInfo.poseeVTV, FHE.asEbool(false));
        vehicleInfo.ultimoKilometraje = FHE.select(
            vehicleExists, 
            FHE.select(FHE.gt(kilometros, vehicleInfo.ultimoKilometraje), kilometros, vehicleInfo.ultimoKilometraje),
            kilometros
        );
        vehicleInfo.existe = FHE.asEbool(true);

        // Otorgar permisos FHE según documentación oficial
        FHE.allowThis(kilometros);
        FHE.allow(kilometros, msg.sender);
        FHE.allowThis(vehicleInfo.ultimoKilometraje);
        FHE.allow(vehicleInfo.ultimoKilometraje, msg.sender);

        emit InfoBlockCreated(
            blockId,
            _vehicleId,
            msg.sender
        );

        return blockId;
    }

    function getInfoBlock(euint32 _id) public view returns (
        string memory vehicleId,
        string memory detalles,
        string memory origen,
        address createdBy
    ) {
        InfoBlock memory infoBlock = infoBlocks[_id];
        require(infoBlock.createdBy != address(0), "El bloque no existe");
        return (
            infoBlock.vehicleId,
            infoBlock.detalles,
            infoBlock.origen,
            infoBlock.createdBy
        );
    }
    
    // NOTA: En producción, esta función requeriría decryption asíncrono
    function getDecryptedInfoBlock(euint32 _id) public view returns (
        string memory message
    ) {
        InfoBlock memory infoBlock = infoBlocks[_id];
        require(infoBlock.createdBy == msg.sender, "Solo el creador puede desencriptar");
        
        return "Usar decryption asincrono para obtener valores encriptados";
        
        // En una implementación real con async decrypt:
        // return (
        //     FHE.decrypt(infoBlock.id),        // Requiere async decrypt
        //     infoBlock.vehicleId,              // Plain text
        //     FHE.decrypt(infoBlock.kilometros), // Requiere async decrypt
        //     infoBlock.detalles,               // Plain text
        //     infoBlock.origen,                 // Plain text
        //     infoBlock.createdBy,              // Plain text
        //     FHE.decrypt(infoBlock.timestamp)  // Requiere async decrypt
        // );
    }

    function updateInfoBlock(
        euint32 _id,
        string memory _detalles,
        string memory _origen
    ) public {
        InfoBlock storage infoBlock = infoBlocks[_id];
        require(infoBlock.createdBy == msg.sender, "Solo el creador puede actualizar el bloque");
        require(bytes(_detalles).length > 0, "Los detalles no pueden estar vacios");
        require(bytes(_origen).length > 0, "El origen no puede estar vacio");

        infoBlock.detalles = _detalles;
        infoBlock.origen = _origen;

        emit InfoBlockCreated(
            _id,
            infoBlock.vehicleId,
            msg.sender
        );
    }

    function getBlocksByCreator(address _creator) public view returns (euint32[] memory) {
        return userBlocks[_creator];
    }

    function blockExists(euint32 _id) public view returns (bool) {
        return infoBlocks[_id].createdBy != address(0);
    }

    // Funciones específicas para vehículos
    function getVehicleBlocks(string memory _vehicleId) public view returns (euint32[] memory) {
        return vehicleBlocks[_vehicleId];
    }

    // Función para verificar si un vehículo existe (sin revelar información encriptada)
    function getVehicleInfo(string memory _vehicleId) public view returns (
        bool exists // Solo información no encriptada
    ) {
        // Verificamos la longitud del array de bloques como proxy de existencia
        return vehicleBlocks[_vehicleId].length > 0;
    }
    
    // NOTA: Esta función usaría decryption asíncrono en producción
    // Para simplicidad del ejemplo, mantenemos la estructura pero comentamos decrypt
    function getDecryptedVehicleInfo(string memory _vehicleId) public view returns (
        string memory message
    ) {
        // Verificar que el usuario tenga al menos un bloque del vehículo
        require(vehicleBlocks[_vehicleId].length > 0, "Vehiculo no encontrado");
        bool hasAccess = false;
        euint32[] memory blocks = vehicleBlocks[_vehicleId];
        for (uint i = 0; i < blocks.length; i++) {
            if (infoBlocks[blocks[i]].createdBy == msg.sender) {
                hasAccess = true;
                break;
            }
        }
        require(hasAccess, "No autorizado para ver esta informacion");
        
        // En una implementación real, esto requeriría decryption asíncrono
        return "Usar decryption asincrono para obtener valores encriptados";
        
        // VehicleInfo memory vehicleInfo = vehicles[_vehicleId];
        // return (
        //     FHE.decrypt(vehicleInfo.activo),      // Requiere async decrypt
        //     FHE.decrypt(vehicleInfo.poseeVTV),    // Requiere async decrypt  
        //     FHE.decrypt(vehicleInfo.ultimoKilometraje), // Requiere async decrypt
        //     true // exists
        // );
    }

    function updateVehicleStatus(
        string memory _vehicleId,
        ebool encryptedActivo,
        ebool encryptedPoseeVTV
    ) public {
        // Verificar que el vehículo existe usando información no encriptada
        require(vehicleBlocks[_vehicleId].length > 0, "El vehiculo no esta registrado");
        
        // Verificar que el usuario tenga al menos un bloque del vehículo
        bool hasAccess = false;
        euint32[] memory blocks = vehicleBlocks[_vehicleId];
        for (uint i = 0; i < blocks.length; i++) {
            if (infoBlocks[blocks[i]].createdBy == msg.sender) {
                hasAccess = true;
                break;
            }
        }
        require(hasAccess, "No tienes permisos para actualizar este vehiculo");
        
        VehicleInfo storage vehicleInfo = vehicles[_vehicleId];
        vehicleInfo.activo = encryptedActivo;
        vehicleInfo.poseeVTV = encryptedPoseeVTV;
        
        // Otorgar permisos FHE
        FHE.allowThis(vehicleInfo.activo);
        FHE.allow(vehicleInfo.activo, msg.sender);
        FHE.allowThis(vehicleInfo.poseeVTV);
        FHE.allow(vehicleInfo.poseeVTV, msg.sender);
        
        emit VehicleStatusUpdated(_vehicleId, msg.sender);
    }

    function isVehicleRegistered(string memory _vehicleId) public view returns (bool) {
        return vehicleBlocks[_vehicleId].length > 0;
    }

    // NOTA: Esta función requeriría decryption asíncrono para obtener el valor real
    function getCurrentKilometraje(string memory _vehicleId) public view returns (string memory) {
        require(vehicleBlocks[_vehicleId].length > 0, "El vehiculo no esta registrado");
        
        // Verificar que el usuario tenga acceso
        bool hasAccess = false;
        euint32[] memory blocks = vehicleBlocks[_vehicleId];
        for (uint i = 0; i < blocks.length; i++) {
            if (infoBlocks[blocks[i]].createdBy == msg.sender) {
                hasAccess = true;
                break;
            }
        }
        require(hasAccess, "No autorizado para ver esta informacion");
        
        return "Usar decryption asincrono para obtener kilometraje";
        // return FHE.decrypt(vehicles[_vehicleId].ultimoKilometraje); // Requiere async decrypt
    }

    // Función adicional para obtener el total de vehículos registrados
    function getTotalVehicles() public view returns (uint32) {
        // Esta función requeriría un contador adicional para ser eficiente
        // Por ahora retorna 0 como placeholder
        return 0;
    }

    // Función para verificar si un usuario tiene acceso a un vehículo
    function hasVehicleAccess(string memory _vehicleId, address _user) public view returns (bool) {
        euint32[] memory blocks = vehicleBlocks[_vehicleId];
        for (uint i = 0; i < blocks.length; i++) {
            if (infoBlocks[blocks[i]].createdBy == _user) {
                return true;
            }
        }
        return false;
    }
}