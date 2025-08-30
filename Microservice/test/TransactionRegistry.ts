import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("TransactionRegistry", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();
  const [deployer, user1, user2] = await viem.getWalletClients();

  it("Should start with zero transactions", async function () {
    const registry = await viem.deployContract("TransactionRegistry");
    const count = await registry.read.getTransactionCount();
    assert.equal(count, 0n);
  });

  it("Should create a transaction and emit TransactionCreated event", async function () {
    const registry = await viem.deployContract("TransactionRegistry");

    await viem.assertions.emitWithArgs(
      registry.write.createTransaction([
        "Transporte de mercancia",
        150n,
        "Empresa A",
        "Empresa B"
      ]),
      registry,
      "TransactionCreated",
      [1n, "Transporte de mercancia", 150n, "Empresa A", "Empresa B", deployer.account.address],
    );
  });

  it("Should create and retrieve a transaction correctly", async function () {
    const registry = await viem.deployContract("TransactionRegistry");

    const txId = await registry.write.createTransaction([
      "Transporte de mercancia",
      150n,
      "Empresa A",
      "Empresa B"
    ]);

    const transaction = await registry.read.getTransaction([1n]);
    
    assert.equal(transaction[0], 1n); // id
    assert.equal(transaction[1], "Transporte de mercancia"); // texto
    assert.equal(transaction[2], 150n); // km
    assert.equal(transaction[3], "Empresa A"); // entidadEmisora
    assert.equal(transaction[4], "Empresa B"); // entidadReceptora
    assert.equal(transaction[5], deployer.account.address); // createdBy
    assert(transaction[6] > 0n); // timestamp
  });

  it("Should reject transaction with empty text", async function () {
    const registry = await viem.deployContract("TransactionRegistry");

    try {
      await registry.write.createTransaction([
        "",
        150n,
        "Empresa A",
        "Empresa B"
      ]);
      assert.fail("Should have reverted");
    } catch (error: any) {
      assert(error.message.includes("El texto no puede estar vacio"));
    }
  });

  it("Should reject transaction with zero km", async function () {
    const registry = await viem.deployContract("TransactionRegistry");

    try {
      await registry.write.createTransaction([
        "Transporte de mercancia",
        0n,
        "Empresa A",
        "Empresa B"
      ]);
      assert.fail("Should have reverted");
    } catch (error: any) {
      assert(error.message.includes("Los kilometros deben ser mayor a 0"));
    }
  });

  it("Should update transaction by creator", async function () {
    const registry = await viem.deployContract("TransactionRegistry");

    await registry.write.createTransaction([
      "Transporte inicial",
      100n,
      "Empresa A",
      "Empresa B"
    ]);

    await viem.assertions.emitWithArgs(
      registry.write.updateTransaction([
        1n,
        "Transporte actualizado",
        200n,
        "Empresa A Modificada",
        "Empresa B Modificada"
      ]),
      registry,
      "TransactionUpdated",
      [1n, "Transporte actualizado", 200n, "Empresa A Modificada", "Empresa B Modificada", deployer.account.address],
    );

    const transaction = await registry.read.getTransaction([1n]);
    assert.equal(transaction[1], "Transporte actualizado");
    assert.equal(transaction[2], 200n);
  });

  it("Should reject update from non-creator", async function () {
    const registry = await viem.deployContract("TransactionRegistry");

    await registry.write.createTransaction([
      "Transporte inicial",
      100n,
      "Empresa A",
      "Empresa B"
    ]);

    const registryAsUser1 = await viem.getContractAt("TransactionRegistry", registry.address, { client: { wallet: user1 } });

    try {
      await registryAsUser1.write.updateTransaction([
        1n,
        "Transporte actualizado",
        200n,
        "Empresa A Modificada",
        "Empresa B Modificada"
      ]);
      assert.fail("Should have reverted");
    } catch (error: any) {
      assert(error.message.includes("Solo el creador puede actualizar la transaccion"));
    }
  });

  it("Should track transactions by creator", async function () {
    const registry = await viem.deployContract("TransactionRegistry");

    // Create transactions with deployer
    await registry.write.createTransaction(["Tx 1", 100n, "A", "B"]);
    await registry.write.createTransaction(["Tx 2", 200n, "C", "D"]);

    // Create transaction with user1
    const registryAsUser1 = await viem.getContractAt("TransactionRegistry", registry.address, { client: { wallet: user1 } });
    await registryAsUser1.write.createTransaction(["Tx 3", 300n, "E", "F"]);

    const deployerTxs = await registry.read.getTransactionsByCreator([deployer.account.address]);
    const user1Txs = await registry.read.getTransactionsByCreator([user1.account.address]);

    assert.equal(deployerTxs.length, 2);
    assert.equal(user1Txs.length, 1);
    assert.equal(deployerTxs[0], 1n);
    assert.equal(deployerTxs[1], 2n);
    assert.equal(user1Txs[0], 3n);
  });

  it("Should check transaction existence correctly", async function () {
    const registry = await viem.deployContract("TransactionRegistry");

    assert.equal(await registry.read.transactionExists([1n]), false);
    
    await registry.write.createTransaction(["Test", 100n, "A", "B"]);
    
    assert.equal(await registry.read.transactionExists([1n]), true);
    assert.equal(await registry.read.transactionExists([999n]), false);
  });
});
