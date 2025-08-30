# Sistema de Certificación Vehicular con Blockchain

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

Backend API para un sistema de certificación vehicular utilizando tecnología blockchain. Permite la gestión segura y transparente de certificaciones de vehículos con autenticación de usuarios.

## Características

- 🔐 **Autenticación JWT** - Sistema de login seguro con tokens
- 👥 **Gestión de Usuarios** - CRUD completo con roles y permisos
- 🚗 **Certificación Vehicular** - Base para certificados blockchain
- 📊 **Base de datos PostgreSQL** - Almacenamiento robusto con TypeORM
- 🐳 **Docker** - Configuración lista para desarrollo

## Iniciar Proyecto

1. **Clonar proyecto**
```bash
git clone [repository-url]
cd backend
```

2. **Instalar dependencias**
```bash
yarn install
```

3. **Configurar variables de entorno**
Crear archivo `.env` con:
```env
DB_PASSWORD=postgres
DB_NAME=vehicle_certification
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
JWT_SECRET=your-jwt-secret-key
```

4. **Levantar base de datos**
```bash
docker-compose up -d
```

5. **Ejecutar aplicación**
```bash
yarn start:dev
```

## Módulos Disponibles

- **Auth** - Autenticación y autorización
- **Users** - Gestión de usuarios y roles
- **Guests** - Base para futuros módulos vehiculares

## Comandos Útiles

```bash
# Desarrollo
yarn start:dev

# Producción
yarn build
yarn start:prod

# Testing
yarn test
yarn test:e2e

# Linting
yarn lint
```