# 📋 Cómo Registrar Datos en la Blockchain

¡Perfecto! Ya tienes tu nodo Hardhat corriendo y el contrato `TransactionRegistry` desplegado. Aquí te explico cómo registrar datos en la blockchain.

## 🎯 Contrato Desplegado

- **Dirección**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **Red**: Hardhat Local Network (http://127.0.0.1:8545)
- **Contrato**: TransactionRegistry

## 🚀 Formas de Registrar Datos

### 1. Script Completo con Ejemplos

```bash
# Ejecutar el script completo que muestra todo el proceso
node examples/register-transaction.js
```

Este script:
- ✅ Consulta transacciones existentes
- ✅ Registra una nueva transacción de ejemplo
- ✅ Verifica que se registró correctamente
- ✅ Muestra el total de transacciones

### 2. Script Rápido para Uso Directo

```bash
# Ejecutar ejemplos rápidos
node examples/quick-register.js
```

### 3. Usar las Funciones Directamente

Puedes importar las funciones en tu propio código:

```javascript
import { registrarTransaccion, consultarTransaccion, obtenerTotalTransacciones } from './examples/quick-register.js';

// Registrar una nueva transacción
const resultado = await registrarTransaccion(
  "Transporte de mercancía urgente",
  320,
  "Logística Express S.L.",
  "Almacenes del Norte S.A."
);

if (resultado.success) {
  console.log("✅ Registrado con ID:", resultado.transactionId);
} else {
  console.log("❌ Error:", resultado.error);
}

// Consultar una transacción específica
const transaccion = await consultarTransaccion(1);

// Obtener total de transacciones
const total = await obtenerTotalTransacciones();
```

## 📝 Estructura de una Transacción

Cada transacción que registres debe incluir:

- **Descripción**: Texto descriptivo del transporte/envío
- **Kilómetros**: Distancia recorrida (debe ser > 0)
- **Empresa Origen**: Nombre de la empresa que envía
- **Empresa Destino**: Nombre de la empresa que recibe

## 🔧 Comandos Útiles

### Verificar que el nodo esté corriendo
```bash
# En otra terminal, verificar conexión
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' http://127.0.0.1:8545
```

### Consultar balance de la cuenta
```bash
# Ejecutar en la consola de Hardhat
npx hardhat console --network localhost
```

Dentro de la consola:
```javascript
const [signer] = await ethers.getSigners();
console.log("Dirección:", await signer.getAddress());
console.log("Balance:", ethers.formatEther(await signer.provider.getBalance(signer.address)));
```

## 📊 Ejemplos de Datos para Registrar

### Ejemplo 1: Transporte de Mercancía
```javascript
await registrarTransaccion(
  "Envío de productos farmacéuticos con cadena de frío",
  580,
  "FarmaCorp Madrid",
  "Farmacias del Mediterráneo"
);
```

### Ejemplo 2: Logística Urbana
```javascript
await registrarTransaccion(
  "Distribución de paquetería en zona metropolitana",
  45,
  "Express Delivery",
  "Cliente Final - Calle Mayor 123"
);
```

### Ejemplo 3: Transporte Internacional
```javascript
await registrarTransaccion(
  "Exportación de maquinaria industrial a Francia",
  1250,
  "Industrias Españolas S.A.",
  "Manufacturing France SARL"
);
```

## 🔍 Verificar Transacciones

Puedes verificar que tus transacciones se registraron correctamente:

```javascript
// Consultar transacción específica
const tx = await consultarTransaccion(1);

// Ver todas las transacciones
const total = await obtenerTotalTransacciones();
for (let i = 1; i <= total; i++) {
  await consultarTransaccion(i);
}
```

## ⚠️ Notas Importantes

1. **Nodo debe estar corriendo**: Asegúrate de que `npx hardhat node` esté ejecutándose
2. **Dirección del contrato**: Usa siempre `0x5FbDB2315678afecb367f032d93F642f64180aa3`
3. **Datos válidos**: La descripción no puede estar vacía y los kilómetros deben ser > 0
4. **Gas**: Las transacciones consumen gas, pero en la red local es gratuito
5. **Persistencia**: Los datos se mantienen mientras el nodo esté corriendo

## 🎉 ¡Listo para Usar!

Ya puedes empezar a registrar datos en tu blockchain. Los scripts están listos para usar y puedes modificarlos según tus necesidades específicas.

### Próximos Pasos

1. Ejecuta `node examples/register-transaction.js` para ver el ejemplo completo
2. Modifica los datos en los scripts según tus necesidades
3. Integra las funciones en tu aplicación principal
4. ¡Disfruta de tu blockchain funcionando! 🚀