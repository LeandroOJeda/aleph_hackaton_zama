// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Registro de transacciones con información detallada
contract TransactionRegistry {
  uint32 private _transactionCount;
  
  struct Transaction {
    uint32 id;
    string texto;
    uint32 km;
    string entidadEmisora;
    string entidadReceptora;
    address createdBy;
    uint256 timestamp;
  }
  
  mapping(uint32 => Transaction) private _transactions;
  
  event TransactionCreated(
    uint32 indexed id,
    string texto,
    uint32 km,
    string entidadEmisora,
    string entidadReceptora,
    address indexed createdBy
  );
  
  event TransactionUpdated(
    uint32 indexed id,
    string texto,
    uint32 km,
    string entidadEmisora,
    string entidadReceptora
  );

  /// @notice Retorna el número total de transacciones
  function getTransactionCount() external view returns (uint32) {
    return _transactionCount;
  }
  
  /// @notice Crea una nueva transacción
  function createTransaction(
    string memory texto,
    uint32 km,
    string memory entidadEmisora,
    string memory entidadReceptora
  ) external returns (uint32) {
    require(bytes(texto).length > 0, "El texto no puede estar vacio");
    require(bytes(entidadEmisora).length > 0, "La entidad emisora no puede estar vacia");
    require(bytes(entidadReceptora).length > 0, "La entidad receptora no puede estar vacia");
    
    _transactionCount++;
    
    _transactions[_transactionCount] = Transaction({
      id: _transactionCount,
      texto: texto,
      km: km,
      entidadEmisora: entidadEmisora,
      entidadReceptora: entidadReceptora,
      createdBy: msg.sender,
      timestamp: block.timestamp
    });
    
    emit TransactionCreated(
      _transactionCount,
      texto,
      km,
      entidadEmisora,
      entidadReceptora,
      msg.sender
    );
    
    return _transactionCount;
  }
  
  /// @notice Obtiene una transacción por su ID
  function getTransaction(uint32 id) external view returns (
    uint32,
    string memory,
    uint32,
    string memory,
    string memory,
    address,
    uint256
  ) {
    require(id > 0 && id <= _transactionCount, "ID de transaccion invalido");
    
    Transaction memory txn = _transactions[id];
    return (
      txn.id,
      txn.texto,
      txn.km,
      txn.entidadEmisora,
      txn.entidadReceptora,
      txn.createdBy,
      txn.timestamp
    );
  }
  
  /// @notice Actualiza una transacción existente (solo el creador puede hacerlo)
  function updateTransaction(
    uint32 id,
    string memory texto,
    uint32 km,
    string memory entidadEmisora,
    string memory entidadReceptora
  ) external {
    require(id > 0 && id <= _transactionCount, "ID de transaccion invalido");
    require(_transactions[id].createdBy == msg.sender, "Solo el creador puede actualizar la transaccion");
    require(bytes(texto).length > 0, "El texto no puede estar vacio");
    require(bytes(entidadEmisora).length > 0, "La entidad emisora no puede estar vacia");
    require(bytes(entidadReceptora).length > 0, "La entidad receptora no puede estar vacia");
    
    _transactions[id].texto = texto;
    _transactions[id].km = km;
    _transactions[id].entidadEmisora = entidadEmisora;
    _transactions[id].entidadReceptora = entidadReceptora;
    
    emit TransactionUpdated(
      id,
      texto,
      km,
      entidadEmisora,
      entidadReceptora
    );
  }
  
  /// @notice Obtiene todas las transacciones creadas por una dirección específica
  function getTransactionsByCreator(address creator) external view returns (uint32[] memory) {
    uint32[] memory result = new uint32[](_transactionCount);
    uint32 count = 0;
    
    for (uint32 i = 1; i <= _transactionCount; i++) {
      if (_transactions[i].createdBy == creator) {
        result[count] = i;
        count++;
      }
    }
    
    // Redimensionar el array al tamaño correcto
    uint32[] memory finalResult = new uint32[](count);
    for (uint32 j = 0; j < count; j++) {
      finalResult[j] = result[j];
    }
    
    return finalResult;
  }
  
  /// @notice Verifica si una transacción existe
  function transactionExists(uint32 id) external view returns (bool) {
    return id > 0 && id <= _transactionCount;
  }
}