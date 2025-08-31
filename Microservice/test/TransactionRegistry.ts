import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("VehicleInfoRegistry", async function () {
  const hre = await network.connect();
  const publicClient = await hre.viem.getPublicClient();
  const [deployer, user1, user2] = await hre.viem.getWalletClients();

  it("Should start with zero info blocks", async function () {
    const registry = await hre.viem.deployContract("VehicleInfoRegistry");
    const count = await registry.read.getBlockCount();
    assert.equal(count, 0n);
  });

  it("Should create an info block and emit InfoBlockCreated event", async function () {
    const registry = await hre.viem.deployContract("VehicleInfoRegistry");

    await hre.viem.assertions.emitWithArgs(
      registry.write.createInfoBlock([
        "ABC123",
        25000n,
        "aseguro el auto con La Caja Seguros",
        "La Caja Seguros"
      ]),
      registry,
      "InfoBlockCreated",
      [1n, "ABC123", 25000n, "aseguro el auto con La Caja Seguros", "La Caja Seguros", deployer.account.address],
    );
  });

  it("Should create and retrieve an info block correctly", async function () {
    const registry = await hre.viem.deployContract("VehicleInfoRegistry");

    await registry.write.createInfoBlock([
      "ABC123",
      25000n,
      "aseguro el auto con La Caja Seguros",
      "La Caja Seguros"
    ]);

    const infoBlock = await registry.read.getInfoBlock([1n]);
    
    assert.equal(infoBlock[0], 1n); // id
    assert.equal(infoBlock[1], "ABC123"); // vehicleId
    assert.equal(infoBlock[2], 25000n); // kilometros
    assert.equal(infoBlock[3], "aseguro el auto con La Caja Seguros"); // detalles
    assert.equal(infoBlock[4], "La Caja Seguros"); // origen
    assert.equal(infoBlock[5], deployer.account.address); // createdBy
    assert(infoBlock[6] > 0n); // timestamp
  });

  it("Should reject info block with empty vehicle ID", async function () {
    const registry = await hre.viem.deployContract("VehicleInfoRegistry");

    try {
      await registry.write.createInfoBlock([
        "",
        25000n,
        "aseguro el auto",
        "La Caja Seguros"
      ]);
      assert.fail("Should have reverted");
    } catch (error: any) {
      assert(error.message.includes("El vehicleId no puede estar vacio"));
    }
  });

  it("Should reject info block with zero km", async function () {
    const registry = await hre.viem.deployContract("VehicleInfoRegistry");

    try {
      await registry.write.createInfoBlock([
        "ABC123",
        0n,
        "aseguro el auto",
        "La Caja Seguros"
      ]);
      assert.fail("Should have reverted");
    } catch (error: any) {
      assert(error.message.includes("Los kilometros deben ser mayor a 0"));
    }
  });

  it("Should update info block by creator", async function () {
    const registry = await hre.viem.deployContract("VehicleInfoRegistry");

    await registry.write.createInfoBlock([
      "ABC123",
      25000n,
      "aseguro el auto inicial",
      "La Caja Seguros"
    ]);

    await hre.viem.assertions.emitWithArgs(
      registry.write.updateInfoBlock([
        1n,
        "ABC123",
        30000n,
        "aseguro el auto actualizado",
        "La Caja Seguros Modificada"
      ]),
      registry,
      "InfoBlockCreated",
      [1n, "ABC123", 30000n, "aseguro el auto actualizado", "La Caja Seguros Modificada", deployer.account.address],
    );

    const infoBlock = await registry.read.getInfoBlock([1n]);
    assert.equal(infoBlock[3], "aseguro el auto actualizado");
    assert.equal(infoBlock[2], 30000n);
  });

  it("Should reject update from non-creator", async function () {
    const registry = await hre.viem.deployContract("VehicleInfoRegistry");

    await registry.write.createInfoBlock([
      "ABC123",
      25000n,
      "aseguro el auto inicial",
      "La Caja Seguros"
    ]);

    const registryAsUser1 = await hre.viem.getContractAt("VehicleInfoRegistry", registry.address, { client: { wallet: user1 } });

    try {
      await registryAsUser1.write.updateInfoBlock([
        1n,
        "ABC123",
        30000n,
        "aseguro el auto actualizado",
        "La Caja Seguros Modificada"
      ]);
      assert.fail("Should have reverted");
    } catch (error: any) {
      assert(error.message.includes("Solo el creador puede actualizar el bloque"));
    }
  });

  it("Should track info blocks by creator", async function () {
    const registry = await hre.viem.deployContract("VehicleInfoRegistry");

    // Create blocks with deployer
    await registry.write.createInfoBlock(["ABC123", 25000n, "aseguro el auto", "La Caja Seguros"]);
    await registry.write.createInfoBlock(["DEF456", 15000n, "service mecanico", "Taller Perez"]);

    // Create block with user1
    const registryAsUser1 = await hre.viem.getContractAt("VehicleInfoRegistry", registry.address, { client: { wallet: user1 } });
    await registryAsUser1.write.createInfoBlock(["GHI789", 30000n, "verificacion tecnica", "VTV Centro"]);

    const deployerBlocks = await registry.read.getBlocksByCreator([deployer.account.address]);
    const user1Blocks = await registry.read.getBlocksByCreator([user1.account.address]);

    assert.equal(deployerBlocks.length, 2);
    assert.equal(user1Blocks.length, 1);
    assert.equal(deployerBlocks[0], 1n);
    assert.equal(deployerBlocks[1], 2n);
    assert.equal(user1Blocks[0], 3n);
  });

  it("Should check info block existence correctly", async function () {
    const registry = await hre.viem.deployContract("VehicleInfoRegistry");

    assert.equal(await registry.read.blockExists([1n]), false);
    
    await registry.write.createInfoBlock(["ABC123", 25000n, "aseguro el auto", "La Caja Seguros"]);
    
    assert.equal(await registry.read.blockExists([1n]), true);
    assert.equal(await registry.read.blockExists([999n]), false);
  });

  it("Should manage vehicle information correctly", async function () {
    const registry = await hre.viem.deployContract("VehicleInfoRegistry");

    // Create first block for vehicle
    await registry.write.createInfoBlock(["ABC123", 25000n, "aseguro el auto", "La Caja Seguros"]);
    
    // Check vehicle info
    const vehicleInfo = await registry.read.getVehicleInfo(["ABC123"]);
    assert.equal(vehicleInfo[0], true); // activo
    assert.equal(vehicleInfo[1], false); // poseeVTV
    assert.equal(vehicleInfo[2], 25000n); // ultimoKilometraje
    assert.equal(vehicleInfo[3], true); // existe

    // Update vehicle status
    await registry.write.updateVehicleStatus(["ABC123", true, true]);
    
    const updatedInfo = await registry.read.getVehicleInfo(["ABC123"]);
    assert.equal(updatedInfo[1], true); // poseeVTV should be true now
  });

  it("Should get vehicle blocks correctly", async function () {
    const registry = await hre.viem.deployContract("VehicleInfoRegistry");

    // Create multiple blocks for same vehicle
    await registry.write.createInfoBlock(["ABC123", 25000n, "aseguro el auto", "La Caja Seguros"]);
    await registry.write.createInfoBlock(["ABC123", 27000n, "service mecanico", "Taller Perez"]);
    await registry.write.createInfoBlock(["DEF456", 15000n, "verificacion tecnica", "VTV Centro"]);

    const vehicleBlocks = await registry.read.getVehicleBlocks(["ABC123"]);
    assert.equal(vehicleBlocks.length, 2);
    assert.equal(vehicleBlocks[0], 1n);
    assert.equal(vehicleBlocks[1], 2n);
  });

  it("Should prevent mileage decrease", async function () {
    const registry = await hre.viem.deployContract("VehicleInfoRegistry");

    // Create first block
    await registry.write.createInfoBlock(["ABC123", 25000n, "aseguro el auto", "La Caja Seguros"]);

    // Try to create block with lower mileage
    try {
      await registry.write.createInfoBlock(["ABC123", 20000n, "service mecanico", "Taller Perez"]);
      assert.fail("Should have reverted");
    } catch (error: any) {
      assert(error.message.includes("Los kilometros no pueden ser menores al ultimo registrado"));
    }
  });
});
