import { ethers } from "ethers";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Cargar el ABI del contrato VehicleInfoRegistry
const contractArtifact = require('../artifacts/contracts/TransactionRegistry.sol/VehicleInfoRegistry.json');

// Configuración
const CONTRACT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const RPC_URL = "http://127.0.0.1:8545";

/**
 * Función rápida para registrar información vehicular
 * @param {string} vehicleId - ID del vehículo
 * @param {number} kilometros - Kilometraje actual
 * @param {string} detalles - Detalles del registro
 * @param {string} origen - Origen del registro (taller, concesionario, etc.)
 */
export async function registrarInfoVehicular(vehicleId, kilometros, detalles, origen) {
  try {
    // Validaciones básicas
    if (!vehicleId || vehicleId.trim() === "") {
      throw new Error("El ID del vehículo no puede estar vacío");
    }
    if (!kilometros || kilometros <= 0) {
      throw new Error("Los kilómetros deben ser mayor a 0");
    }
    if (!detalles || detalles.trim() === "") {
      throw new Error("Los detalles no pueden estar vacíos");
    }
    if (!origen || origen.trim() === "") {
      throw new Error("El origen no puede estar vacío");
    }

    console.log("🚀 Registrando información vehicular...");
    
    // Conectar a la blockchain
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const signer = await provider.getSigner(0);
    
    // Usar el ABI del contrato cargado
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractArtifact.abi, signer);
    
    // Enviar transacción
    const tx = await contract.createInfoBlock(
      vehicleId,
      kilometros,
      detalles,
      origen
    );
    
    console.log("⏳ Esperando confirmación...");
    const receipt = await tx.wait();
    
    // Obtener ID del bloque de información
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
      const vehicleId = parsedEvent.args[1];
      
      console.log("✅ ¡Información vehicular registrada exitosamente!");
      console.log("🆔 ID del bloque:", blockId.toString());
      console.log("🚗 Vehículo:", vehicleId);
      console.log("📋 Hash:", tx.hash);
      console.log("🧱 Bloque:", receipt.blockNumber);
      
      return {
        success: true,
        blockId: blockId.toString(),
        vehicleId: vehicleId,
        hash: tx.hash,
        blockNumber: receipt.blockNumber
      };
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Función para consultar información vehicular específica
 * @param {string} vehicleId - ID del vehículo a consultar
 */
export async function consultarInfoVehicular(vehicleId) {
  try {
    console.log(`🔍 Consultando información del vehículo ${vehicleId}...`);
    
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractArtifact.abi, provider);
    
    // Obtener datos del vehículo
    const vehicleInfo = await contract.getVehicleInfo(vehicleId);
    
    console.log("📋 Información del vehículo:");
    console.log("🚗 ID del vehículo:", vehicleId);
    console.log("📏 Kilómetros:", vehicleInfo.kilometers.toString());
    console.log("📝 Detalles:", vehicleInfo.details);
    console.log("🏢 Origen:", vehicleInfo.origin);
    console.log("✅ Activo:", vehicleInfo.isActive);
    console.log("🔧 VTV válida:", vehicleInfo.hasValidVTV);
    console.log("⏰ Última actualización:", new Date(Number(vehicleInfo.lastUpdate) * 1000).toLocaleString());
    
    return {
      vehicleId: vehicleId,
      kilometers: vehicleInfo.kilometers.toString(),
      details: vehicleInfo.details,
      origin: vehicleInfo.origin,
      isActive: vehicleInfo.isActive,
      hasValidVTV: vehicleInfo.hasValidVTV,
      lastUpdate: Number(vehicleInfo.lastUpdate)
    };
  } catch (error) {
    console.error("❌ Error al consultar información vehicular:", error.message);
    throw error;
  }
}

/**
 * Función para obtener el total de bloques de información
 */
export async function obtenerTotalBloques() {
  try {
    console.log("📊 Obteniendo total de bloques de información...");
    
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractArtifact.abi, provider);
    
    const total = await contract.getTotalInfoBlocks();
    
    console.log("📈 Total de bloques de información:", total.toString());
    
    return Number(total);
  } catch (error) {
    console.error("❌ Error al obtener total:", error.message);
    throw error;
  }
}

// Ejemplo de uso
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    try {
      console.log("🚀 Iniciando ejemplo de registro vehicular...");
      
      // Registrar información vehicular
      const resultado = await registrarInfoVehicular(
        "ABC123",
        45000,
        "Mantenimiento preventivo realizado",
        "Taller Oficial Honda"
      );
      
      if (resultado.success) {
        console.log("\n⏳ Esperando 2 segundos antes de consultar...");
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Consultar la información vehicular recién creada
        await consultarInfoVehicular(resultado.vehicleId);
        
        // Obtener total de bloques de información
        await obtenerTotalBloques();
      }
      
    } catch (error) {
      console.error("💥 Error en el ejemplo:", error.message);
    }
  })();
}