// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {TransactionRegistry} from "./TransactionRegistry.sol";

contract TransactionRegistryTest {
    TransactionRegistry registry;

    function setUp() public {
        registry = new TransactionRegistry();
    }

    function test_InitialState() public view {
        require(registry.getTransactionCount() == 0, "Initial transaction count should be 0");
    }

    function test_CreateTransaction() public {
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
        require(createdBy == address(this), "Created by should match");
        require(timestamp > 0, "Timestamp should be set");
    }

    function test_UpdateTransaction() public {
        uint32 txId = registry.createTransaction(
            "Transporte inicial",
            100,
            "Empresa A",
            "Empresa B"
        );
        
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

    function test_TransactionExists() public {
        require(!registry.transactionExists(1), "Transaction 1 should not exist initially");
        
        uint32 txId = registry.createTransaction("Test", 100, "A", "B");
        
        require(registry.transactionExists(txId), "Transaction should exist after creation");
        require(!registry.transactionExists(999), "Non-existent transaction should return false");
    }

    function test_MultipleTransactions() public {
        uint32 txId1 = registry.createTransaction("Tx 1", 100, "A", "B");
        uint32 txId2 = registry.createTransaction("Tx 2", 200, "C", "D");
        
        require(registry.getTransactionCount() == 2, "Should have 2 transactions");
        require(txId1 == 1, "First transaction ID should be 1");
        require(txId2 == 2, "Second transaction ID should be 2");
        
        uint32[] memory creatorTxs = registry.getTransactionsByCreator(address(this));
        require(creatorTxs.length == 2, "Creator should have 2 transactions");
        require(creatorTxs[0] == txId1, "First transaction should match");
        require(creatorTxs[1] == txId2, "Second transaction should match");
    }
}
