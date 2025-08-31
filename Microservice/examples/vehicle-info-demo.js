import { ethers } from "ethers";
import { createRequire } from 'module';
import dotenv from 'dotenv';
const require = createRequire(import.meta.url);

// Cargar variables de entorno
dotenv.config();

// Cargar el ABI del contrato
const contractArtifact = require('../artifacts/contracts/TransactionRegistry.sol/VehicleInfoRegistry.json');

async function demoCompleto() {
    try {
        console.log('🚗 Demo completo del sistema de bloques de información vehicular');
        console.log('=' .repeat(70));
        
        // Configuración de la red Sepolia
        const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID');
        const wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);
        
        // Dirección del contrato desplegado
        const contractAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
        
        // Crear instancia del contrato
        const contract = new ethers.Contract(contractAddress, contractArtifact.abi, wallet);
        
        const vehicleId = 'DEF456'; // Usar un vehículo diferente
        
        // Ejemplo 1: Seguro
        console.log('\n📋 Ejemplo 1: Registro de seguro');
        await crearBloque(contract, {
            vehicleId: vehicleId,
            kilometros: 50000,
            detalles: 'aseguro el auto con La Caja Seguros - Póliza completa con cobertura total contra todo riesgo',
            origen: 'La Caja Seguros'
        });
        
        // Ejemplo 2: Service mecánico
        console.log('\n📋 Ejemplo 2: Service mecánico');
        await crearBloque(contract, {
            vehicleId: vehicleId,
            kilometros: 55000,
            detalles: 'hizo un service al auto con cambio de aceite, filtros de aire y combustible, revisión de frenos',
            origen: 'Taller Mecánico Rodriguez'
        });
        
        // Ejemplo 3: Verificación técnica
        console.log('\n📋 Ejemplo 3: Verificación técnica vehicular');
        await crearBloque(contract, {
            vehicleId: vehicleId,
            kilometros: 57000,
            detalles: 'realizó verificación técnica vehicular (VTV) - Aprobada sin observaciones',
            origen: 'Centro de Verificación Técnica'
        });
        
        // Actualizar estado VTV del vehículo
        console.log('\n🔧 Actualizando estado VTV del vehículo...');
        const updateTx = await contract.updateVehicleStatus(vehicleId, true, true);
        await updateTx.wait();
        console.log('✅ Estado VTV actualizado');
        
        // Ejemplo 4: Reparación
        console.log('\n📋 Ejemplo 4: Reparación');
        await crearBloque(contract, {
            vehicleId: vehicleId,
            kilometros: 60000,
            detalles: 'reparó el sistema de frenos - Cambio de pastillas y discos delanteros',
            origen: 'Taller de Frenos Especializado'
        });
        
        // Mostrar resumen completo
        console.log('\n' + '=' .repeat(70));
        console.log('📊 RESUMEN COMPLETO DEL VEHÍCULO');
        console.log('=' .repeat(70));
        
        // Información del vehículo
        const vehicleInfo = await contract.getVehicleInfo(vehicleId);
        console.log(`\n🚗 Información del vehículo ${vehicleId}:`);
        console.log(`  ✅ Estado: ${vehicleInfo[0] ? 'Activo' : 'Inactivo'}`);
        console.log(`  🔧 VTV: ${vehicleInfo[1] ? 'Vigente' : 'No vigente'}`);
        console.log(`  🛣️  Último kilometraje: ${vehicleInfo[2]} km`);
        console.log(`  📋 Registrado: ${vehicleInfo[3] ? 'Sí' : 'No'}`);
        
        // Historial completo
        const vehicleBlocks = await contract.getVehicleBlocks(vehicleId);
        console.log(`\n📦 Historial completo (${vehicleBlocks.length} bloques):`);
        
        for (let i = 0; i < vehicleBlocks.length; i++) {
            const blockId = vehicleBlocks[i];
            const block = await contract.getInfoBlock(blockId);
            
            console.log(`\n  📋 Bloque ${i + 1} (ID: ${block[0]}):`);
            console.log(`    🛣️  Kilómetros: ${block[2]}`);
            console.log(`    📝 Detalles: ${block[3]}`);
            console.log(`    🏢 Origen: ${block[4]}`);
            console.log(`    ⏰ Fecha: ${new Date(Number(block[6]) * 1000).toLocaleString()}`);
        }
        
        // Estadísticas generales
        const totalBlocks = await contract.getBlockCount();
        console.log(`\n📊 Estadísticas generales:`);
        console.log(`  📦 Total de bloques en el sistema: ${totalBlocks}`);
        console.log(`  🚗 Bloques de este vehículo: ${vehicleBlocks.length}`);
        
        console.log('\n🎉 Demo completado exitosamente!');
        
    } catch (error) {
        console.error('❌ Error en el demo:', error.message);
    }
}

async function crearBloque(contract, datos) {
    console.log(`  🏢 ${datos.origen} ${datos.detalles.split(' ')[0]} el auto con: ${datos.kilometros} kilómetros`);
    
    const tx = await contract.createInfoBlock(
        datos.vehicleId,
        datos.kilometros,
        datos.detalles,
        datos.origen
    );
    
    const receipt = await tx.wait();
    const event = receipt.logs[0];
    console.log(`  ✅ Bloque creado con ID: ${event.args[0]}`);
    
    return event.args[0];
}

// Ejecutar el demo
demoCompleto();