// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract VehicleInfoRegistry {
    // Estructura genérica para bloques de información vehicular
    struct InfoBlock {
        uint32 id;
        string vehicleId; // Identificador del vehículo
        uint32 kilometros; // Kilómetros al momento del registro
        string detalles; // Campo de texto libre para detalles
        string origen; // Usuario/entidad que creó el bloque
        address createdBy; // Dirección que creó el registro
        uint256 timestamp; // Momento de creación
    }
    
    // Información adicional por vehículo
    struct VehicleInfo {
        bool activo; // Estado activo/inactivo
        bool poseeVTV; // Posee Verificación Técnica Vehicular
        uint32 ultimoKilometraje; // Último kilometraje registrado
        bool existe; // Para verificar si el vehículo está registrado
    }

    mapping(uint32 => InfoBlock) private infoBlocks;
    mapping(string => uint32[]) private vehicleBlocks; // vehicleId => block IDs
    mapping(address => uint32[]) private userBlocks;
    mapping(string => VehicleInfo) private vehicles; // vehicleId => vehicle info
    uint32 private nextId = 1;

    event InfoBlockCreated(
        uint32 indexed id,
        string indexed vehicleId,
        uint32 kilometros,
        string detalles,
        string origen,
        address indexed createdBy
    );

    event VehicleStatusUpdated(
        string indexed vehicleId,
        bool activo,
        bool poseeVTV,
        address indexed updatedBy
    );

    event KilometrajeUpdated(
        string indexed vehicleId,
        uint32 previousKm,
        uint32 newKm,
        address indexed updatedBy
    );

    function getBlockCount() public view returns (uint32) {
        return nextId - 1;
    }

    function createInfoBlock(
        string memory _vehicleId,
        uint32 _kilometros,
        string memory _detalles,
        string memory _origen
    ) public returns (uint32) {
        require(bytes(_vehicleId).length > 0, "El ID del vehiculo no puede estar vacio");
        require(bytes(_detalles).length > 0, "Los detalles no pueden estar vacios");
        require(bytes(_origen).length > 0, "El origen no puede estar vacio");
        require(_kilometros > 0, "Los kilometros deben ser mayor a 0");
        
        // Validar kilometraje no sea menor al actual (excepto para registros iniciales)
        if (vehicles[_vehicleId].existe && vehicles[_vehicleId].ultimoKilometraje > 0) {
            require(_kilometros >= vehicles[_vehicleId].ultimoKilometraje, "El kilometraje no puede ser menor al actual");
        }

        uint32 blockId = nextId;
        nextId++;

        infoBlocks[blockId] = InfoBlock({
            id: blockId,
            vehicleId: _vehicleId,
            kilometros: _kilometros,
            detalles: _detalles,
            origen: _origen,
            createdBy: msg.sender,
            timestamp: block.timestamp
        });

        vehicleBlocks[_vehicleId].push(blockId);
        userBlocks[msg.sender].push(blockId);

        // Actualizar información del vehículo
        if (!vehicles[_vehicleId].existe) {
            vehicles[_vehicleId] = VehicleInfo({
                activo: true,
                poseeVTV: false,
                ultimoKilometraje: _kilometros,
                existe: true
            });
        } else {
            vehicles[_vehicleId].ultimoKilometraje = _kilometros;
        }

        emit InfoBlockCreated(
            blockId,
            _vehicleId,
            _kilometros,
            _detalles,
            _origen,
            msg.sender
        );

        return blockId;
    }

    function getInfoBlock(uint32 _id) public view returns (
        uint32 id,
        string memory vehicleId,
        uint32 kilometros,
        string memory detalles,
        string memory origen,
        address createdBy,
        uint256 timestamp
    ) {
        require(blockExists(_id), "El bloque de informacion no existe");
        
        InfoBlock memory infoBlockData = infoBlocks[_id];
        return (
            infoBlockData.id,
            infoBlockData.vehicleId,
            infoBlockData.kilometros,
            infoBlockData.detalles,
            infoBlockData.origen,
            infoBlockData.createdBy,
            infoBlockData.timestamp
        );
    }

    function updateInfoBlock(
        uint32 _id,
        string memory _detalles,
        string memory _origen
    ) public {
        require(blockExists(_id), "El bloque de informacion no existe");
        require(infoBlocks[_id].createdBy == msg.sender, "Solo el creador puede actualizar el bloque");
        require(bytes(_detalles).length > 0, "Los detalles no pueden estar vacios");
        require(bytes(_origen).length > 0, "El origen no puede estar vacio");

        infoBlocks[_id].detalles = _detalles;
        infoBlocks[_id].origen = _origen;

        emit InfoBlockCreated(
            _id,
            infoBlocks[_id].vehicleId,
            infoBlocks[_id].kilometros,
            _detalles,
            _origen,
            msg.sender
        );
    }

    function getBlocksByCreator(address _creator) public view returns (uint32[] memory) {
        return userBlocks[_creator];
    }

    function blockExists(uint32 _id) public view returns (bool) {
        return _id > 0 && _id < nextId;
    }

    // Funciones específicas para vehículos
    function getVehicleBlocks(string memory _vehicleId) public view returns (uint32[] memory) {
        return vehicleBlocks[_vehicleId];
    }

    function getVehicleInfo(string memory _vehicleId) public view returns (
        bool activo,
        bool poseeVTV,
        uint32 ultimoKilometraje,
        bool existe
    ) {
        VehicleInfo memory info = vehicles[_vehicleId];
        return (info.activo, info.poseeVTV, info.ultimoKilometraje, info.existe);
    }

    function updateVehicleStatus(
        string memory _vehicleId,
        bool _activo,
        bool _poseeVTV
    ) public {
        require(vehicles[_vehicleId].existe, "El vehiculo no existe");
        
        vehicles[_vehicleId].activo = _activo;
        vehicles[_vehicleId].poseeVTV = _poseeVTV;

        emit VehicleStatusUpdated(_vehicleId, _activo, _poseeVTV, msg.sender);
    }

    function isVehicleRegistered(string memory _vehicleId) public view returns (bool) {
        return vehicles[_vehicleId].existe;
    }

    function getCurrentKilometraje(string memory _vehicleId) public view returns (uint32) {
        require(vehicles[_vehicleId].existe, "El vehiculo no existe");
        return vehicles[_vehicleId].ultimoKilometraje;
    }
}
