import { ethers } from "ethers";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Cargar el ABI del contrato
const contractArtifact = require('../artifacts/contracts/TransactionRegistry.sol/VehicleInfoRegistry.json');

async function registrarBloqueVehicular() {
    try {
        console.log('🚗 Iniciando registro de bloque de información vehicular...');
        
        // Configuración de la red local
        const provider = new ethers.JsonRpcProvider('http://localhost:8545');
        const wallet = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', provider);
        
        // Dirección del contrato desplegado
        const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
        
        // Crear instancia del contrato
        const contract = new ethers.Contract(contractAddress, contractArtifact.abi, wallet);
        
        // Datos del bloque de información vehicular
        const datosBloque = {
            vehicleId: 'ABC123',
            kilometros: 45000,
            detalles: 'aseguro el auto con La Caja Seguros - Póliza completa con cobertura total',
            origen: 'La Caja Seguros'
        };
    
        console.log("\n📦 Datos del bloque a registrar:");
        console.log(`  🚗 ID del vehículo: ${datosBloque.vehicleId}`);
        console.log(`  🛣️  Kilómetros: ${datosBloque.kilometros}`);
        console.log(`  📝 Detalles: ${datosBloque.detalles}`);
        console.log(`  🏢 Origen: ${datosBloque.origen}`);
        
        // Crear el bloque de información
        console.log("\n⏳ Creando bloque de información vehicular...");
        const tx = await contract.createInfoBlock(
            datosBloque.vehicleId,
            datosBloque.kilometros,
            datosBloque.detalles,
            datosBloque.origen
        );
        
        console.log(`📋 Hash de transacción: ${tx.hash}`);
        
        // Esperar confirmación
        console.log("⏳ Esperando confirmación...");
        const receipt = await tx.wait();
        console.log(`✅ Transacción confirmada en el bloque: ${receipt.blockNumber}`);
        
        // Verificar el evento emitido
        const events = receipt.logs;
        if (events.length > 0) {
            console.log("\n🎉 Evento InfoBlockCreated emitido:");
            const event = events[0];
            console.log(`  🆔 ID del bloque: ${event.args[0]}`);
            console.log(`  🚗 ID del vehículo: ${event.args[1]}`);
            console.log(`  🛣️  Kilómetros: ${event.args[2]}`);
            console.log(`  📝 Detalles: ${event.args[3]}`);
            console.log(`  🏢 Origen: ${event.args[4]}`);
            console.log(`  👤 Creado por: ${event.args[5]}`);
        }
        
        // Consultar los datos almacenados
        console.log("\n🔍 Consultando datos almacenados...");
        const blockId = events[0].args[0];
        const infoBlock = await contract.getInfoBlock(blockId);
        
        console.log("\n📋 Datos del InfoBlock:");
        console.log(`  🆔 ID: ${infoBlock[0]}`);
        console.log(`  🚗 ID del vehículo: ${infoBlock[1]}`);
        console.log(`  🛣️  Kilómetros: ${infoBlock[2]}`);
        console.log(`  📝 Detalles: ${infoBlock[3]}`);
        console.log(`  🏢 Origen: ${infoBlock[4]}`);
        console.log(`  👤 Creado por: ${infoBlock[5]}`);
        console.log(`  ⏰ Timestamp: ${new Date(Number(infoBlock[6]) * 1000).toLocaleString()}`);
        
        // Consultar información del vehículo
        const vehicleInfo = await contract.getVehicleInfo(datosBloque.vehicleId);
        console.log("\n🚗 Información del vehículo:");
        console.log(`  ✅ Activo: ${vehicleInfo[0]}`);
        console.log(`  🔧 Posee VTV: ${vehicleInfo[1]}`);
        console.log(`  🛣️  Último kilometraje: ${vehicleInfo[2]} km`);
        console.log(`  📋 Registrado: ${vehicleInfo[3]}`);
        
        // Mostrar estadísticas
        const totalBlocks = await contract.getBlockCount();
        const vehicleBlocks = await contract.getVehicleBlocks(datosBloque.vehicleId);
        console.log(`\n📊 Total de bloques de información: ${totalBlocks}`);
        console.log(`📦 Bloques del vehículo ${datosBloque.vehicleId}: ${vehicleBlocks.length}`);
        
        console.log("\n🎉 Bloque de información vehicular almacenado exitosamente en la blockchain!");
        
    } catch (error) {
        console.error("❌ Error al registrar el bloque vehicular:", error.message);
    }
}

// Ejecutar la función
registrarBloqueVehicular();