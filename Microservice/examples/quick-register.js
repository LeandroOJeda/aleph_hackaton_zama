import { ethers } from "ethers";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Cargar el ABI del contrato directamente
const contractArtifact = require('../artifacts/contracts/TransactionRegistry.sol/TransactionRegistry.json');

// Configuración
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const RPC_URL = "http://127.0.0.1:8545";

/**
 * Función rápida para registrar una transacción
 * @param {string} descripcion - Descripción del transporte
 * @param {number} kilometros - Distancia en kilómetros
 * @param {string} empresaOrigen - Empresa que envía
 * @param {string} empresaDestino - Empresa que recibe
 */
export async function registrarTransaccion(descripcion, kilometros, empresaOrigen, empresaDestino) {
  try {
    // Validaciones básicas
    if (!descripcion || descripcion.trim() === "") {
      throw new Error("La descripción no puede estar vacía");
    }
    if (!kilometros || kilometros <= 0) {
      throw new Error("Los kilómetros deben ser mayor a 0");
    }
    if (!empresaOrigen || !empresaDestino) {
      throw new Error("Debe especificar empresa origen y destino");
    }

    console.log("🚀 Registrando transacción...");
    
    // Conectar a la blockchain
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const signer = await provider.getSigner(0);
    
    // Usar el ABI del contrato cargado
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractArtifact.abi, signer);
    
    // Enviar transacción
    const tx = await contract.createTransaction(
      descripcion,
      kilometros,
      empresaOrigen,
      empresaDestino
    );
    
    console.log("⏳ Esperando confirmación...");
    const receipt = await tx.wait();
    
    // Obtener ID de la transacción
    const event = receipt.logs.find(log => {
      try {
        const parsed = contract.interface.parseLog(log);
        return parsed.name === "TransactionCreated";
      } catch {
        return false;
      }
    });
    
    if (event) {
      const parsedEvent = contract.interface.parseLog(event);
      const transactionId = parsedEvent.args[0];
      
      console.log("✅ ¡Transacción registrada exitosamente!");
      console.log("🆔 ID:", transactionId.toString());
      console.log("📋 Hash:", tx.hash);
      console.log("🧱 Bloque:", receipt.blockNumber);
      
      return {
        success: true,
        transactionId: transactionId.toString(),
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
 * Función para consultar una transacción específica
 * @param {number} transactionId - ID de la transacción
 */
export async function consultarTransaccion(transactionId) {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const signer = await provider.getSigner(0);
    
    // Usar el ABI del contrato cargado
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractArtifact.abi, signer);
    
    const exists = await contract.transactionExists(transactionId);
    if (!exists) {
      throw new Error(`La transacción ${transactionId} no existe`);
    }
    
    const tx = await contract.getTransaction(transactionId);
    
    const result = {
      id: tx[0].toString(),
      descripcion: tx[1],
      kilometros: tx[2].toString(),
      empresaOrigen: tx[3],
      empresaDestino: tx[4],
      creadoPor: tx[5],
      fecha: new Date(Number(tx[6]) * 1000).toLocaleString()
    };
    
    console.log("📋 Transacción encontrada:");
    console.log("🆔 ID:", result.id);
    console.log("📝 Descripción:", result.descripcion);
    console.log("📏 Kilómetros:", result.kilometros);
    console.log("🏢 De:", result.empresaOrigen);
    console.log("🏢 Para:", result.empresaDestino);
    console.log("👤 Creado por:", result.creadoPor);
    console.log("📅 Fecha:", result.fecha);
    
    return result;
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    return null;
  }
}

/**
 * Función para obtener el total de transacciones
 */
export async function obtenerTotalTransacciones() {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const signer = await provider.getSigner(0);
    
    // Usar el ABI del contrato cargado
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractArtifact.abi, signer);
    
    const total = await contract.getTransactionCount();
    console.log("📊 Total de transacciones:", total.toString());
    
    return Number(total);
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    return 0;
  }
}

// Ejemplos de uso si se ejecuta directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("🌟 === EJEMPLOS DE USO ===");
  
  // Ejemplo 1: Registrar una transacción
  console.log("\n1️⃣ Registrando transacción de ejemplo...");
  await registrarTransaccion(
    "Envío de productos electrónicos",
    450,
    "TechCorp Madrid",
    "ElectroStore Valencia"
  );
  
  // Ejemplo 2: Consultar total
  console.log("\n2️⃣ Consultando total de transacciones...");
  const total = await obtenerTotalTransacciones();
  
  // Ejemplo 3: Consultar la última transacción
  if (total > 0) {
    console.log("\n3️⃣ Consultando última transacción...");
    await consultarTransaccion(total);
  }
}