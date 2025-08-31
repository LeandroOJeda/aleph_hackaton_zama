const { expect } = require("chai");
const { ethers } = require("hardhat");
const { FhevmInstance } = require("@fhevm/hardhat-plugin");

describe("VehicleInfoRegistry with FHEVM", function () {
  let vehicleRegistry;
  let owner;
  let addr1;
  let addr2;
  let fhevmInstance;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    // Deploy the contract
    const VehicleInfoRegistry = await ethers.getContractFactory("VehicleInfoRegistry");
    vehicleRegistry = await VehicleInfoRegistry.deploy();
    await vehicleRegistry.waitForDeployment();
    
    // Initialize FHEVM instance
    fhevmInstance = await FhevmInstance.create();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await vehicleRegistry.getAddress()).to.be.properAddress;
    });
  });

  describe("Creating Info Blocks", function () {
    it("Should create an encrypted info block", async function () {
      const vehicleId = "VEH001";
      const kilometros = 50000;
      const detalles = "Mantenimiento regular";
      const origen = "Taller ABC";
      
      // Encrypt the kilometros value
      const encryptedKilometros = fhevmInstance.encrypt32(kilometros);
      
      await expect(
        vehicleRegistry.createInfoBlock(
          vehicleId,
          encryptedKilometros,
          detalles,
          origen
        )
      ).to.emit(vehicleRegistry, "InfoBlockCreated");
    });

    it("Should register vehicle as existing after first block", async function () {
      const vehicleId = "VEH002";
      const kilometros = 25000;
      const detalles = "Registro inicial";
      const origen = "Concesionario XYZ";
      
      const encryptedKilometros = fhevmInstance.encrypt32(kilometros);
      
      await vehicleRegistry.createInfoBlock(
        vehicleId,
        encryptedKilometros,
        detalles,
        origen
      );
      
      expect(await vehicleRegistry.isVehicleRegistered(vehicleId)).to.be.true;
    });
  });

  describe("Vehicle Information Access", function () {
    beforeEach(async function () {
      const vehicleId = "VEH003";
      const kilometros = 75000;
      const detalles = "Inspección técnica";
      const origen = "ITV Oficial";
      
      const encryptedKilometros = fhevmInstance.encrypt32(kilometros);
      
      await vehicleRegistry.createInfoBlock(
        vehicleId,
        encryptedKilometros,
        detalles,
        origen
      );
    });

    it("Should allow creator to access decrypted vehicle info", async function () {
      const vehicleId = "VEH003";
      
      const vehicleInfo = await vehicleRegistry.getDecryptedVehicleInfo(vehicleId);
      expect(vehicleInfo.existe).to.be.true;
      expect(vehicleInfo.activo).to.be.true;
      expect(vehicleInfo.poseeVTV).to.be.false;
    });

    it("Should deny access to unauthorized users", async function () {
      const vehicleId = "VEH003";
      
      await expect(
        vehicleRegistry.connect(addr1).getDecryptedVehicleInfo(vehicleId)
      ).to.be.revertedWith("No autorizado para ver esta informacion");
    });
  });

  describe("Vehicle Status Updates", function () {
    beforeEach(async function () {
      const vehicleId = "VEH004";
      const kilometros = 30000;
      const detalles = "Registro inicial";
      const origen = "Propietario";
      
      const encryptedKilometros = fhevmInstance.encrypt32(kilometros);
      
      await vehicleRegistry.createInfoBlock(
        vehicleId,
        encryptedKilometros,
        detalles,
        origen
      );
    });

    it("Should update vehicle status with encrypted values", async function () {
      const vehicleId = "VEH004";
      const encryptedActivo = fhevmInstance.encryptBool(true);
      const encryptedPoseeVTV = fhevmInstance.encryptBool(true);
      
      await expect(
        vehicleRegistry.updateVehicleStatus(
          vehicleId,
          encryptedActivo,
          encryptedPoseeVTV
        )
      ).to.emit(vehicleRegistry, "VehicleStatusUpdated");
    });

    it("Should prevent unauthorized status updates", async function () {
      const vehicleId = "VEH004";
      const encryptedActivo = fhevmInstance.encryptBool(false);
      const encryptedPoseeVTV = fhevmInstance.encryptBool(true);
      
      await expect(
        vehicleRegistry.connect(addr1).updateVehicleStatus(
          vehicleId,
          encryptedActivo,
          encryptedPoseeVTV
        )
      ).to.be.revertedWith("No tienes permisos para actualizar este vehiculo");
    });
  });

  describe("Data Privacy", function () {
    it("Should keep sensitive data encrypted for unauthorized users", async function () {
      const vehicleId = "VEH005";
      const kilometros = 100000;
      const detalles = "Datos sensibles";
      const origen = "Propietario";
      
      const encryptedKilometros = fhevmInstance.encrypt32(kilometros);
      
      await vehicleRegistry.createInfoBlock(
        vehicleId,
        encryptedKilometros,
        detalles,
        origen
      );
      
      // Public function should only return non-sensitive data
      const publicInfo = await vehicleRegistry.getVehicleInfo(vehicleId);
      expect(publicInfo.existe).to.be.true;
      
      // Encrypted data should not be accessible without proper authorization
      const blockId = fhevmInstance.encrypt32(1);
      const publicBlockInfo = await vehicleRegistry.connect(addr1).getInfoBlock(blockId);
      expect(publicBlockInfo.vehicleId).to.equal(vehicleId);
      expect(publicBlockInfo.detalles).to.equal(detalles);
      expect(publicBlockInfo.origen).to.equal(origen);
    });
  });
});