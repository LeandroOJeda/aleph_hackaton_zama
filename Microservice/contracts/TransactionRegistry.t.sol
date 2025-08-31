// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {VehicleInfoRegistry} from "./TransactionRegistry.sol";

contract VehicleInfoRegistryTest {
    VehicleInfoRegistry registry;

    function setUp() public {
        registry = new VehicleInfoRegistry();
    }

    function test_InitialState() public view {
        require(registry.getBlockCount() == 0, "Initial block count should be 0");
    }

    function test_CreateInfoBlock() public {
        uint32 blockId = registry.createInfoBlock(
            "ABC123",
            25000,
            "aseguro el auto con La Caja Seguros",
            "La Caja Seguros"
        );
        
        require(blockId == 1, "First block ID should be 1");
        require(registry.getBlockCount() == 1, "Block count should be 1");
        
        (uint32 id, string memory vehicleId, uint32 kilometros, string memory detalles, string memory origen, address createdBy, uint256 timestamp) = registry.getInfoBlock(blockId);
        
        require(id == 1, "Block ID should match");
        require(keccak256(bytes(vehicleId)) == keccak256(bytes("ABC123")), "Vehicle ID should match");
        require(kilometros == 25000, "Kilometros should match");
        require(keccak256(bytes(detalles)) == keccak256(bytes("aseguro el auto con La Caja Seguros")), "Detalles should match");
        require(keccak256(bytes(origen)) == keccak256(bytes("La Caja Seguros")), "Origen should match");
        require(createdBy == address(this), "Created by should match");
        require(timestamp > 0, "Timestamp should be set");
    }

    function test_UpdateInfoBlock() public {
        uint32 blockId = registry.createInfoBlock(
            "ABC123",
            25000,
            "aseguro el auto inicial",
            "La Caja Seguros"
        );
        
        registry.updateInfoBlock(
            blockId,
            "aseguro el auto actualizado",
            "La Caja Seguros Modificada"
        );
        
        (,, uint32 kilometros, string memory detalles, string memory origen,,) = registry.getInfoBlock(blockId);
        
        require(keccak256(bytes(detalles)) == keccak256(bytes("aseguro el auto actualizado")), "Detalles should be updated");
        require(kilometros == 25000, "Kilometros should remain unchanged");
        require(keccak256(bytes(origen)) == keccak256(bytes("La Caja Seguros Modificada")), "Origen should be updated");
    }

    function test_BlockExists() public {
        require(!registry.blockExists(1), "Block 1 should not exist initially");
        
        uint32 blockId = registry.createInfoBlock("ABC123", 25000, "aseguro el auto", "La Caja Seguros");
        
        require(registry.blockExists(blockId), "Block should exist after creation");
        require(!registry.blockExists(999), "Non-existent block should return false");
    }

    function test_VehicleInfo() public {
        uint32 blockId = registry.createInfoBlock("ABC123", 25000, "aseguro el auto", "La Caja Seguros");
        
        (bool activo, bool poseeVTV, uint32 ultimoKilometraje, bool existe) = registry.getVehicleInfo("ABC123");
        
        require(activo == true, "Vehicle should be active");
        require(poseeVTV == false, "Vehicle should not have VTV initially");
        require(ultimoKilometraje == 25000, "Last mileage should match");
        require(existe == true, "Vehicle should exist");
        
        // Update vehicle status
        registry.updateVehicleStatus("ABC123", true, true);
        
        (, bool newVTV,,) = registry.getVehicleInfo("ABC123");
        require(newVTV == true, "Vehicle should have VTV after update");
    }

    function test_MultipleBlocks() public {
        uint32 blockId1 = registry.createInfoBlock("ABC123", 25000, "aseguro el auto", "La Caja Seguros");
        uint32 blockId2 = registry.createInfoBlock("DEF456", 15000, "service mecanico", "Taller Perez");
        
        require(registry.getBlockCount() == 2, "Should have 2 blocks");
        require(blockId1 == 1, "First block ID should be 1");
        require(blockId2 == 2, "Second block ID should be 2");
        
        uint32[] memory creatorBlocks = registry.getBlocksByCreator(address(this));
        require(creatorBlocks.length == 2, "Creator should have 2 blocks");
        require(creatorBlocks[0] == blockId1, "First block should match");
        require(creatorBlocks[1] == blockId2, "Second block should match");
        
        uint32[] memory vehicleBlocks = registry.getVehicleBlocks("ABC123");
        require(vehicleBlocks.length == 1, "Vehicle ABC123 should have 1 block");
        require(vehicleBlocks[0] == blockId1, "Vehicle block should match");
    }
}
