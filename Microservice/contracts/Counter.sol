// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TransactionRegistry {
    struct Transaction {
        uint32 id;
        string texto;
        uint32 km;
        string entidadEmisora;
        string entidadReceptora;
        address createdBy;
        uint256 timestamp;
    }

    mapping(uint32 => Transaction) private transactions;
    mapping(address => uint32[]) private userTransactions;
    uint32 private nextId = 1;

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
        string entidadReceptora,
        address indexed updatedBy
    );

    function getTransactionCount() public view returns (uint32) {
        return nextId - 1;
    }

    function createTransaction(
        string memory _texto,
        uint32 _km,
        string memory _entidadEmisora,
        string memory _entidadReceptora
    ) public returns (uint32) {
        require(bytes(_texto).length > 0, "El texto no puede estar vacio");
        require(_km > 0, "Los kilometros deben ser mayor a 0");
        require(bytes(_entidadEmisora).length > 0, "La entidad emisora no puede estar vacia");
        require(bytes(_entidadReceptora).length > 0, "La entidad receptora no puede estar vacia");

        uint32 transactionId = nextId;
        nextId++;

        transactions[transactionId] = Transaction({
            id: transactionId,
            texto: _texto,
            km: _km,
            entidadEmisora: _entidadEmisora,
            entidadReceptora: _entidadReceptora,
            createdBy: msg.sender,
            timestamp: block.timestamp
        });

        userTransactions[msg.sender].push(transactionId);

        emit TransactionCreated(
            transactionId,
            _texto,
            _km,
            _entidadEmisora,
            _entidadReceptora,
            msg.sender
        );

        return transactionId;
    }

    function getTransaction(uint32 _id) public view returns (
        uint32 id,
        string memory texto,
        uint32 km,
        string memory entidadEmisora,
        string memory entidadReceptora,
        address createdBy,
        uint256 timestamp
    ) {
        require(transactionExists(_id), "La transaccion no existe");
        
        Transaction memory transaction = transactions[_id];
        return (
            transaction.id,
            transaction.texto,
            transaction.km,
            transaction.entidadEmisora,
            transaction.entidadReceptora,
            transaction.createdBy,
            transaction.timestamp
        );
    }

    function updateTransaction(
        uint32 _id,
        string memory _texto,
        uint32 _km,
        string memory _entidadEmisora,
        string memory _entidadReceptora
    ) public {
        require(transactionExists(_id), "La transaccion no existe");
        require(transactions[_id].createdBy == msg.sender, "Solo el creador puede actualizar la transaccion");
        require(bytes(_texto).length > 0, "El texto no puede estar vacio");
        require(_km > 0, "Los kilometros deben ser mayor a 0");
        require(bytes(_entidadEmisora).length > 0, "La entidad emisora no puede estar vacia");
        require(bytes(_entidadReceptora).length > 0, "La entidad receptora no puede estar vacia");

        transactions[_id].texto = _texto;
        transactions[_id].km = _km;
        transactions[_id].entidadEmisora = _entidadEmisora;
        transactions[_id].entidadReceptora = _entidadReceptora;

        emit TransactionUpdated(
            _id,
            _texto,
            _km,
            _entidadEmisora,
            _entidadReceptora,
            msg.sender
        );
    }

    function getTransactionsByCreator(address _creator) public view returns (uint32[] memory) {
        return userTransactions[_creator];
    }

    function transactionExists(uint32 _id) public view returns (bool) {
        return _id > 0 && _id < nextId;
    }
}
