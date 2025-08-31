import { ethers } from "ethers";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Cargar el ABI del contrato
const contractArtifact = require('../artifacts/contracts/TransactionRegistry.sol/VehicleInfoRegistry.json');

// Dirección del contrato desplegado
const CONTRACT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

async function registerVehicleBlock() {
  console.log("🚀 Registrando nuevo bloque de información vehicular en la blockchain...");
  
  try {
    // Conectar al proveedor local
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const signer = await provider.getSigner(0);
    
    console.log("📝 Cuenta que registra:", await signer.getAddress());
    console.log("💰 Balance:", ethers.formatEther(await provider.getBalance(await signer.getAddress())), "ETH");
    
    // Usar el ABI del contrato cargado
    
    // Crear instancia del contrato
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      contractArtifact.abi,
      signer
    );
    
    // Datos de ejemplo para registrar
    const blockData = {
      vehicleId: "XYZ789",
      kilometros: 52000,
      detalles: "hizo un service al auto con cambio de aceite sintético, filtros y revisión completa del motor",
      origen: "Taller Mecánico Especializado"
    };
    
    console.log("\n📦 Datos del bloque a registrar:");
    console.log("- ID del vehículo:", blockData.vehicleId);
    console.log("- Kilómetros:", blockData.kilometros);
    console.log("- Detalles:", blockData.detalles);
    console.log("- Origen:", blockData.origen);
    
    // Registrar el bloque de información
    console.log("\n⏳ Enviando transacción...");
    const tx = await contract.createInfoBlock(
      blockData.vehicleId,
      blockData.kilometros,
      blockData.detalles,
      blockData.origen
    );
    
    console.log("📋 Hash de transacción:", tx.hash);
    console.log("⏳ Esperando confirmación...");
    
    // Esperar confirmación
    const receipt = await tx.wait();
    console.log("✅ Transacción confirmada en el bloque:", receipt.blockNumber);
    
    // Obtener el ID del bloque del evento
    const event = receipt.logs.find(log => {
      try {
        const parsed = contract.interface.parseLog(log);
        return parsed.name === "InfoBlockCreated";
      } catch {
        return false;
      }
    });
    
    if (event) {
      const parsedEvent = contract.interface.parseLog(event);
      const blockId = parsedEvent.args[0];
      console.log("🆔 ID de bloque registrado:", blockId.toString());
      
      // Verificar que se registró correctamente
      console.log("\n🔍 Verificando datos registrados...");
      const registeredBlock = await contract.getInfoBlock(blockId);
      
      console.log("✅ Datos verificados:");
      console.log("- ID:", registeredBlock[0].toString());
      console.log("- ID del vehículo:", registeredBlock[1]);
      console.log("- Kilómetros:", registeredBlock[2].toString());
      console.log("- Detalles:", registeredBlock[3]);
      console.log("- Origen:", registeredBlock[4]);
      console.log("- Creado por:", registeredBlock[5]);
      console.log("- Timestamp:", new Date(Number(registeredBlock[6]) * 1000).toLocaleString());
      
      // Mostrar información del vehículo
      console.log("\n🚗 Información del vehículo:");
      const vehicleInfo = await contract.getVehicleInfo(blockData.vehicleId);
      console.log("- Estado:", vehicleInfo[0] ? "Activo" : "Inactivo");
      console.log("- VTV:", vehicleInfo[1] ? "Vigente" : "No vigente");
      console.log("- Último kilometraje:", vehicleInfo[2].toString(), "km");
    }
    
    // Mostrar total de bloques
    const totalBlocks = await contract.getBlockCount();
    console.log("\n📊 Total de bloques en el registro:", totalBlocks.toString());
    
  } catch (error) {
    console.error("❌ Error al registrar bloque vehicular:", error.message);
  }
}

// Función para consultar bloques existentes
async function queryVehicleBlocks() {
  console.log("\n🔍 Consultando bloques de información vehicular existentes...");
  
  try {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const signer = await provider.getSigner(0);
    
    // Usar el ABI del contrato cargado
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      contractArtifact.abi,
      signer
    );
    
    const totalBlocks = await contract.getBlockCount();
    console.log("📊 Total de bloques:", totalBlocks.toString());
    
    if (totalBlocks > 0) {
      console.log("\n📋 Listado de bloques de información:");
      for (let i = 1; i <= totalBlocks; i++) {
        const block = await contract.getInfoBlock(i);
        console.log(`\n--- Bloque ${i} ---`);
        console.log("ID del vehículo:", block[1]);
        console.log("Kilómetros:", block[2].toString());
        console.log("Detalles:", block[3]);
        console.log("Origen:", block[4]);
        console.log("Fecha:", new Date(Number(block[6]) * 1000).toLocaleString());
      }
    }
    
  } catch (error) {
    console.error("❌ Error al consultar bloques:", error.message);
  }
}

// Función principal
async function main() {
  console.log("🌟 === REGISTRO DE BLOQUES VEHICULARES EN BLOCKCHAIN ===");
  console.log("📍 Contrato:", CONTRACT_ADDRESS);
  console.log("🌐 Red: Hardhat Local Network");
  
  // Primero consultar bloques existentes
  await queryVehicleBlocks();
  
  console.log("\n" + "=".repeat(50));
  
  // Luego registrar un nuevo bloque
  await registerVehicleBlock();
  
  console.log("\n🎉 ¡Proceso completado!");
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { registerVehicleBlock, queryVehicleBlocks };