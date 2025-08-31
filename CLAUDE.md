# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Vehicle Certification Blockchain System** for Aleph Hackathon using Zama technology. It's a full-stack application with three main components:

1. **Frontend** (`Front/frontWeb3/`) - React + Vite app with role-based access control
2. **Backend** (`backend/`) - NestJS API with PostgreSQL and JWT authentication  
3. **Microservice** (`Microservice/`) - Node.js service for Zama blockchain integration

The system enables secure vehicle certification and tracking using blockchain technology with fully homomorphic encryption via Zama.

## Essential Commands

### Frontend (React + Vite)
```bash
cd Front/frontWeb3
npm install
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Backend (NestJS)
```bash
cd backend
yarn install
yarn start:dev       # Start development server
yarn start:debug     # Start with debugging
yarn build           # Build for production  
yarn start:prod      # Run production build
yarn test            # Run unit tests
yarn test:e2e        # Run e2e tests
yarn test:cov        # Run tests with coverage
yarn lint            # ESLint with auto-fix
yarn format          # Prettier formatting
yarn seed            # Populate database with test data
yarn seed:clear      # Clear all database data
docker-compose up -d # Start PostgreSQL container
```

### Microservice (Zama Blockchain)
```bash
cd Microservice
npm install
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm test             # Run tests
npx hardhat test     # Run Hardhat tests
npx hardhat test solidity  # Run Solidity tests only
npx hardhat test nodejs    # Run Node.js tests only
npx hardhat ignition deploy ignition/modules/VehicleInfoRegistry.ts  # Deploy contract locally
```

## Architecture & Key Patterns

### Multi-Service Architecture
The system follows a microservices pattern:
- **Frontend**: Role-based React SPA with protected routes
- **Backend**: NestJS API with JWT authentication and PostgreSQL
- **Microservice**: Express.js service interfacing with Zama blockchain

### Blockchain Integration (Zama)
- **Smart Contract**: `VehicleInfoRegistry.sol` for immutable vehicle data storage
- **Network**: Zama devnet (chain ID: 8009)
- **RPC Endpoint**: `https://devnet.zama.ai`
- **Features**: Fully homomorphic encryption for privacy-preserving computations

### Role-Based Access Control
Six distinct user roles across both frontend and backend:
- `superadmin` - Full system access
- `admin` - General management permissions
- `aseguradora` - Insurance company representative  
- `taller` - Authorized mechanic/workshop
- `concesionaria` - Vehicle dealership representative
- `consumer` - End user/vehicle owner

### Smart Contract Structure
The `VehicleInfoRegistry` contract manages:
- **InfoBlock**: Individual vehicle records (ID, mileage, details, origin, creator, timestamp)
- **VehicleInfo**: Vehicle metadata (active status, VTV certification, last mileage)
- **Anti-tampering**: Prevents mileage rollback and ensures data integrity

## Key Configuration Files

### Environment Variables
Frontend `.env`:
```env
VITE_API_BASE_URL=http://localhost:3001/api/v1
```

Backend `.env`:
```env
DB_HOST=localhost
DB_PORT=5432  
DB_NAME=vehicle_certification
DB_USERNAME=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-jwt-secret-key
REFRESH_JWT_SECRET=your-refresh-jwt-secret-key
```

Microservice `.env`:
```env
PORT=3000
ZAMA_RPC_URL=https://devnet.zama.ai
ZAMA_NETWORK_ID=8009
ZAMA_API_KEY=your-zama-api-key
```

### Development Setup
1. Start PostgreSQL: `docker-compose up -d` (in backend/)
2. Seed database: `yarn seed` (in backend/)
3. Start backend: `yarn start:dev` (in backend/)
4. Start microservice: `npm run dev` (in Microservice/)
5. Start frontend: `npm run dev` (in Front/frontWeb3/)

## API Endpoints Structure

### Backend (Port 3001)
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User authentication
- `POST /api/v1/auth/refresh-token` - Token refresh
- Role-protected vehicle and organization endpoints

### Microservice (Port 3000)
- `GET /api/blocks/latest` - Latest blockchain block
- `GET /api/blocks/:identifier` - Block by number or hash
- `GET /api/blocks/network/info` - Network information
- `GET /api/vehicles/:vehicleId` - Vehicle information from blockchain
- `POST /api/vehicles/blocks` - Create new vehicle record
- Swagger documentation at `/api-docs`

## Development Patterns

### Frontend Patterns
- React Router for navigation with protected routes
- Redux for state management
- Bootstrap + Tailwind CSS for styling
- Role-based component rendering
- Axios for API communication

### Backend Patterns
- TypeORM with Code-First approach (`synchronize: true`)
- JWT with refresh token mechanism
- Custom decorators: `@Auth()`, `@GetUser()`, `@RoleProtected()`
- Comprehensive seeding system
- PostgreSQL with Docker Compose

### Smart Contract Patterns
- Event emission for all state changes
- Access control (only creators can update their records)
- Data validation (non-empty fields, mileage progression)
- Structured data storage with mappings for efficient queries

## Testing Strategy

### Backend Testing
```bash
yarn test           # Unit tests with Jest
yarn test:watch     # Watch mode
yarn test:e2e       # End-to-end tests
yarn test:cov       # Coverage reports
```

### Smart Contract Testing
```bash
npx hardhat test                    # All tests
npx hardhat test --network hardhat  # Local network
```

## Production Deployment

### Backend Production
```bash
yarn build
yarn start:prod
```

### Frontend Production
```bash
npm run build
npm run preview
```

### Smart Contract Deployment
```bash
# Local deployment
npx hardhat ignition deploy ignition/modules/VehicleInfoRegistry.ts

# Sepolia deployment
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
npx hardhat ignition deploy --network sepolia ignition/modules/VehicleInfoRegistry.ts
```

## Health Checks & Monitoring

### Service Health Endpoints
- Backend: `GET /health`
- Microservice: `GET /health`
- Blockchain connection: `GET /api/blocks/network/status`

## Important File Locations

### Smart Contracts
- `Microservice/contracts/VehicleInfoRegistry.sol` - Main vehicle registry contract
- `Microservice/ignition/modules/VehicleInfoRegistry.ts` - Deployment script

### Key Backend Files  
- `backend/src/auth/` - Complete authentication system
- `backend/src/database/seed.service.ts` - Database seeding
- `backend/CLAUDE.md` - Detailed backend documentation

### Key Frontend Files
- `Front/frontWeb3/src/App.jsx` - Main routing with protected routes
- `Front/frontWeb3/src/components/ProtectedRoute/` - Role-based access control

### Configuration
- `backend/docker-compose.yaml` - PostgreSQL setup
- `Microservice/hardhat.config.cjs` - Hardhat blockchain configuration