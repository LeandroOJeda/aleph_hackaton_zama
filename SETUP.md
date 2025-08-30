# Instrucciones de Configuración

## Prerrequisitos

Antes de ejecutar este microservicio, necesitas instalar Node.js en tu sistema.

### Instalar Node.js

1. **Descargar Node.js:**
   - Ve a [https://nodejs.org/](https://nodejs.org/)
   - Descarga la versión LTS (recomendada)
   - Ejecuta el instalador y sigue las instrucciones

2. **Verificar la instalación:**
   ```bash
   node --version
   npm --version
   ```

### Configuración del Proyecto

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   - Edita el archivo `.env` con tus configuraciones específicas
   - Especialmente la `ZAMA_API_KEY` si tienes una

3. **Iniciar el servidor:**
   ```bash
   # Modo desarrollo
   npm run dev
   
   # Modo producción
   npm start
   ```

## Configuración de Zama Network

Para conectarte a la red Zama, asegúrate de configurar correctamente:

```env
ZAMA_RPC_URL=https://devnet.zama.ai
ZAMA_NETWORK_ID=8009
ZAMA_API_KEY=tu_api_key_aqui
```

### Obtener API Key de Zama

1. Visita el portal de desarrolladores de Zama
2. Regístrate o inicia sesión
3. Crea un nuevo proyecto
4. Copia tu API key al archivo `.env`

## Verificación

Una vez que el servidor esté ejecutándose:

1. **Health Check:**
   ```bash
   curl http://localhost:3000/health
   ```

2. **Información de la red:**
   ```bash
   curl http://localhost:3000/api/blocks/network/status
   ```

3. **Último bloque:**
   ```bash
   curl http://localhost:3000/api/blocks/latest
   ```

## Solución de Problemas

### Error de conexión con Zama
- Verifica que la URL de RPC sea correcta
- Asegúrate de que tu API key sea válida
- Comprueba tu conexión a internet

### Puerto en uso
- Cambia el puerto en el archivo `.env`:
  ```env
  PORT=3001
  ```

### Errores de dependencias
- Elimina `node_modules` y `package-lock.json`
- Ejecuta `npm install` nuevamente

## Estructura de Respuestas

Todas las respuestas de la API siguen este formato:

```json
{
  "success": true,
  "data": {
    // Datos específicos del endpoint
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

En caso de error:

```json
{
  "error": "Tipo de error",
  "message": "Descripción detallada",
  "details": {
    // Información adicional del error
  }
}
```