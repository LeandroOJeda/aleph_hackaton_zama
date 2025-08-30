// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {TransactionRegistry} from "./TransactionRegistry.sol";
import {Test} from "forge-std/Test.sol";

contract TransactionRegistryTest is Test {
    TransactionRegistry registry;
    address user1;
    address user2;

    function setUp() public {
        registry = new TransactionRegistry();
        user1 = address(0x1);
        user2 = address(0x2);
    }

    function test_InitialState() public view {
        require(registry.getTransactionCount() == 0, "Initial transaction count should be 0");
    }

    function test_CreateTransaction() public {
        vm.prank(user1);
        uint32 txId = registry.createTransaction(
            "Transporte de mercancia",
            150,
            "Empresa A",
            "Empresa B"
        );
        
        require(txId == 1, "First transaction ID should be 1");
        require(registry.getTransactionCount() == 1, "Transaction count should be 1");
        
        (uint32 id, string memory texto, uint32 km, string memory emisora, string memory receptora, address createdBy, uint256 timestamp) = registry.getTransaction(txId);
        
        require(id == 1, "Transaction ID should match");
        require(keccak256(bytes(texto)) == keccak256(bytes("Transporte de mercancia")), "Texto should match");
        require(km == 150, "Km should match");
        require(keccak256(bytes(emisora)) == keccak256(bytes("Empresa A")), "Entidad emisora should match");
        require(keccak256(bytes(receptora)) == keccak256(bytes("Empresa B")), "Entidad receptora should match");
        require(createdBy == user1, "Created by should match");
        require(timestamp > 0, "Timestamp should be set");
    }

    function test_CreateTransactionEmptyText() public {
        vm.prank(user1);
        vm.expectRevert("El texto no puede estar vacio");
        registry.createTransaction(
            "",
            150,
            "Empresa A",
            "Empresa B"
        );
    }

    function test_CreateTransactionZeroKm() public {
        vm.prank(user1);
        vm.expectRevert("Los kilometros deben ser mayor a 0");
        registry.createTransaction(
            "Transporte de mercancia",
            0,
            "Empresa A",
            "Empresa B"
        );
    }

    function test_CreateTransactionEmptyEmisora() public {
        vm.prank(user1);
        vm.expectRevert("La entidad emisora no puede estar vacia");
        registry.createTransaction(
            "Transporte de mercancia",
            150,
            "",
            "Empresa B"
        );
    }

    function test_CreateTransactionEmptyReceptora() public {
        vm.prank(user1);
        vm.expectRevert("La entidad receptora no puede estar vacia");
        registry.createTransaction(
            "Transporte de mercancia",
            150,
            "Empresa A",
            ""
        );
    }

    function test_UpdateTransaction() public {
        vm.prank(user1);
        uint32 txId = registry.createTransaction(
            "Transporte inicial",
            100,
            "Empresa A",
            "Empresa B"
        );
        
        vm.prank(user1);
        registry.updateTransaction(
            txId,
            "Transporte actualizado",
            200,
            "Empresa A Modificada",
            "Empresa B Modificada"
        );
        
        (,string memory texto, uint32 km, string memory emisora, string memory receptora,,) = registry.getTransaction(txId);
        
        require(keccak256(bytes(texto)) == keccak256(bytes("Transporte actualizado")), "Texto should be updated");
        require(km == 200, "Km should be updated");
        require(keccak256(bytes(emisora)) == keccak256(bytes("Empresa A Modificada")), "Entidad emisora should be updated");
        require(keccak256(bytes(receptora)) == keccak256(bytes("Empresa B Modificada")), "Entidad receptora should be updated");
    }

    function test_UpdateTransactionUnauthorized() public {
        vm.prank(user1);
        uint32 txId = registry.createTransaction(
            "Transporte inicial",
            100,
            "Empresa A",
            "Empresa B"
        );
        
        vm.prank(user2);
        vm.expectRevert("Solo el creador puede actualizar la transaccion");
        registry.updateTransaction(
            txId,
            "Transporte actualizado",
            200,
            "Empresa A Modificada",
            "Empresa B Modificada"
        );
    }

    function test_GetNonExistentTransaction() public {
        vm.expectRevert("La transaccion no existe");
        registry.getTransaction(999);
    }

    function test_GetTransactionsByCreator() public {
        vm.prank(user1);
        uint32 txId1 = registry.createTransaction("Tx 1", 100, "A", "B");
        
        vm.prank(user1);
        uint32 txId2 = registry.createTransaction("Tx 2", 200, "C", "D");
        
        vm.prank(user2);
        uint32 txId3 = registry.createTransaction("Tx 3", 300, "E", "F");
        
        uint32[] memory user1Txs = registry.getTransactionsByCreator(user1);
        uint32[] memory user2Txs = registry.getTransactionsByCreator(user2);
        
        require(user1Txs.length == 2, "User1 should have 2 transactions");
        require(user2Txs.length == 1, "User2 should have 1 transaction");
        require(user1Txs[0] == txId1, "First transaction should match");
        require(user1Txs[1] == txId2, "Second transaction should match");
        require(user2Txs[0] == txId3, "Third transaction should match");
    }

    function test_TransactionExists() public {
        require(!registry.transactionExists(1), "Transaction 1 should not exist initially");
        
        vm.prank(user1);
        uint32 txId = registry.createTransaction("Test", 100, "A", "B");
        
        require(registry.transactionExists(txId), "Transaction should exist after creation");
        require(!registry.transactionExists(999), "Non-existent transaction should return false");
    }
}
