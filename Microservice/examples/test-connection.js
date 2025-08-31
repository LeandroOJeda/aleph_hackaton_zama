import { ethers } from "ethers";

async function testConnection() {
  try {
    console.log("🔗 Probando conexión a la blockchain...");
    
    // Conectar al proveedor local
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    
    // Obtener información básica
    const network = await provider.getNetwork();
    console.log("🌐 Red conectada:", network.name, "(Chain ID:", network.chainId.toString(), ")");
    
    const blockNumber = await provider.getBlockNumber();
    console.log("🧱 Último bloque:", blockNumber);
    
    // Obtener cuenta
    const signer = await provider.getSigner(0);
    const address = await signer.getAddress();
    const balance = await provider.getBalance(address);
    
    console.log("👤 Cuenta activa:", address);
    console.log("💰 Balance:", ethers.formatEther(balance), "ETH");
    
    console.log("✅ ¡Conexión exitosa!");
    
    return true;
  } catch (error) {
    console.error("❌ Error de conexión:", error.message);
    return false;
  }
}

// Ejecutar test
testConnection().then(success => {
  if (success) {
    console.log("\n🎉 Todo listo para registrar transacciones!");
  } else {
    console.log("\n⚠️ Verifica que el nodo Hardhat esté corriendo");
  }
});