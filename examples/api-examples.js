/**
 * Ejemplos de uso de la API del microservicio Zama
 * 
 * Ejecuta estos ejemplos después de instalar Node.js y las dependencias:
 * npm install
 * npm start
 */

const axios = require('axios');

// Configuración base
const API_BASE_URL = 'http://localhost:3000';

// Cliente HTTP configurado
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Ejemplo 1: Verificar el estado del servicio
 */
async function checkServiceHealth() {
  try {
    console.log('🔍 Verificando estado del servicio...');
    const response = await apiClient.get('/health');
    console.log('✅ Servicio activo:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al verificar el servicio:', error.message);
    throw error;
  }
}

/**
 * Ejemplo 2: Obtener información de la red Zama
 */
async function getNetworkInfo() {
  try {
    console.log('🌐 Obteniendo información de la red...');
    const response = await apiClient.get('/api/blocks/network/info');
    console.log('📊 Información de la red:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener información de la red:', error.message);
    throw error;
  }
}

/**
 * Ejemplo 3: Obtener el último bloque
 */
async function getLatestBlock() {
  try {
    console.log('📦 Obteniendo último bloque...');
    const response = await apiClient.get('/api/blocks/latest');
    console.log('🆕 Último bloque:', {
      number: response.data.data.number,
      hash: response.data.data.hash,
      timestamp: response.data.data.timestamp,
      transactions: response.data.data.transactionCount
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener último bloque:', error.message);
    throw error;
  }
}

/**
 * Ejemplo 4: Obtener un bloque específico por número
 */
async function getBlockByNumber(blockNumber) {
  try {
    console.log(`🔢 Obteniendo bloque #${blockNumber}...`);
    const response = await apiClient.get(`/api/blocks/${blockNumber}`);
    console.log(`📦 Bloque #${blockNumber}:`, {
      hash: response.data.data.hash,
      miner: response.data.data.miner,
      gasUsed: response.data.data.gasUsed,
      transactions: response.data.data.transactionCount
    });
    return response.data;
  } catch (error) {
    console.error(`❌ Error al obtener bloque #${blockNumber}:`, error.message);
    throw error;
  }
}

/**
 * Ejemplo 5: Obtener un rango de bloques
 */
async function getBlockRange(start, end) {
  try {
    console.log(`📊 Obteniendo bloques del ${start} al ${end}...`);
    const response = await apiClient.get(`/api/blocks/range/${start}/${end}`);
    console.log(`📈 Rango de bloques (${start}-${end}):`, {
      totalBlocks: response.data.data.stats.totalBlocks,
      totalTransactions: response.data.data.stats.totalTransactions,
      averageGasUsed: response.data.data.stats.averageGasUsed
    });
    return response.data;
  } catch (error) {
    console.error(`❌ Error al obtener rango ${start}-${end}:`, error.message);
    throw error;
  }
}

/**
 * Ejemplo 6: Buscar bloques con filtros
 */
async function searchBlocks(filters = {}) {
  try {
    console.log('🔍 Buscando bloques con filtros:', filters);
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`/api/blocks/search?${params}`);
    console.log('🎯 Resultados de búsqueda:', {
      blocksFound: response.data.data.stats.totalBlocks,
      filters: response.data.filters
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error en búsqueda:', error.message);
    throw error;
  }
}

/**
 * Ejemplo 7: Listar bloques con paginación
 */
async function listBlocksPaginated(page = 1, limit = 5) {
  try {
    console.log(`📄 Listando bloques - Página ${page}, Límite ${limit}...`);
    const response = await apiClient.get(`/api/blocks?page=${page}&limit=${limit}&detailed=true`);
    console.log(`📋 Lista de bloques:`, {
      page: response.data.pagination.page,
      totalPages: response.data.pagination.totalPages,
      blocksInPage: response.data.data.blocks.length,
      latestBlock: response.data.data.latestBlock
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error al listar bloques:', error.message);
    throw error;
  }
}

/**
 * Ejemplo 8: Obtener estadísticas del último bloque
 */
async function getLatestBlockStats() {
  try {
    console.log('📊 Obteniendo estadísticas del último bloque...');
    const response = await apiClient.get('/api/blocks/stats/latest');
    console.log('📈 Estadísticas:', response.data.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error.message);
    throw error;
  }
}

/**
 * Función principal para ejecutar todos los ejemplos
 */
async function runAllExamples() {
  console.log('🚀 Iniciando ejemplos de la API Zama...');
  console.log('=' .repeat(50));

  try {
    // 1. Verificar servicio
    await checkServiceHealth();
    console.log('\n' + '-'.repeat(50) + '\n');

    // 2. Información de la red
    const networkInfo = await getNetworkInfo();
    console.log('\n' + '-'.repeat(50) + '\n');

    // 3. Último bloque
    const latestBlock = await getLatestBlock();
    console.log('\n' + '-'.repeat(50) + '\n');

    // 4. Estadísticas del último bloque
    await getLatestBlockStats();
    console.log('\n' + '-'.repeat(50) + '\n');

    // 5. Bloque específico (usar el número del último bloque - 1)
    const blockNumber = Math.max(0, latestBlock.data.number - 1);
    await getBlockByNumber(blockNumber);
    console.log('\n' + '-'.repeat(50) + '\n');

    // 6. Rango de bloques
    const rangeStart = Math.max(0, latestBlock.data.number - 5);
    const rangeEnd = latestBlock.data.number;
    await getBlockRange(rangeStart, rangeEnd);
    console.log('\n' + '-'.repeat(50) + '\n');

    // 7. Búsqueda con filtros
    await searchBlocks({
      min_transactions: 1,
      limit: 5
    });
    console.log('\n' + '-'.repeat(50) + '\n');

    // 8. Lista paginada
    await listBlocksPaginated(1, 3);

    console.log('\n' + '='.repeat(50));
    console.log('✅ Todos los ejemplos completados exitosamente!');

  } catch (error) {
    console.log('\n' + '='.repeat(50));
    console.error('❌ Error durante la ejecución de ejemplos:', error.message);
    console.log('\n💡 Asegúrate de que:');
    console.log('   - El servidor esté ejecutándose (npm start)');
    console.log('   - La conexión con Zama esté configurada correctamente');
    console.log('   - Las variables de entorno estén configuradas');
  }
}

/**
 * Función para ejecutar un ejemplo específico
 */
async function runSpecificExample(exampleName, ...args) {
  const examples = {
    health: checkServiceHealth,
    network: getNetworkInfo,
    latest: getLatestBlock,
    block: getBlockByNumber,
    range: getBlockRange,
    search: searchBlocks,
    list: listBlocksPaginated,
    stats: getLatestBlockStats
  };

  if (examples[exampleName]) {
    try {
      await examples[exampleName](...args);
    } catch (error) {
      console.error(`❌ Error en ejemplo '${exampleName}':`, error.message);
    }
  } else {
    console.error(`❌ Ejemplo '${exampleName}' no encontrado.`);
    console.log('Ejemplos disponibles:', Object.keys(examples).join(', '));
  }
}

// Exportar funciones para uso externo
module.exports = {
  checkServiceHealth,
  getNetworkInfo,
  getLatestBlock,
  getBlockByNumber,
  getBlockRange,
  searchBlocks,
  listBlocksPaginated,
  getLatestBlockStats,
  runAllExamples,
  runSpecificExample
};

// Ejecutar ejemplos si el archivo se ejecuta directamente
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    runAllExamples();
  } else {
    const [exampleName, ...exampleArgs] = args;
    runSpecificExample(exampleName, ...exampleArgs);
  }
}