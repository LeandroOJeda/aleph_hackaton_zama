"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../auth/entities/user.entity");
const role_entity_1 = require("../auth/entities/role.entity");
const organization_entity_1 = require("../organizations/entities/organization.entity");
const vehicle_entity_1 = require("../vehicles/entities/vehicle.entity");
const event_entity_1 = require("../events/entities/event.entity");
const organization_types_1 = require("../organizations/interfaces/organization-types");
const valid_roles_1 = require("../auth/interfaces/valid_roles");
const bcrypt = require("bcrypt");
let SeedService = class SeedService {
    constructor(userRepository, roleRepository, organizationRepository, vehicleRepository, eventRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.organizationRepository = organizationRepository;
        this.vehicleRepository = vehicleRepository;
        this.eventRepository = eventRepository;
    }
    async seed() {
        console.log('🌱 Starting database seeding...');
        await this.createRoles();
        await this.createOrganizations();
        await this.createUsers();
        await this.createVehicles();
        await this.createEvents();
        console.log('✅ Database seeding completed!');
    }
    async createRoles() {
        console.log('📋 Creating roles...');
        const rolesToCreate = Object.values(valid_roles_1.ValidRoles);
        for (const roleName of rolesToCreate) {
            const existingRole = await this.roleRepository.findOne({
                where: { name: roleName }
            });
            if (!existingRole) {
                const role = this.roleRepository.create({
                    name: roleName,
                    description: this.getRoleDescription(roleName)
                });
                await this.roleRepository.save(role);
                console.log(`  ✓ Created role: ${roleName}`);
            }
            else {
                console.log(`  - Role already exists: ${roleName}`);
            }
        }
    }
    async createOrganizations() {
        console.log('🏢 Creating organizations...');
        const organizations = [
            {
                name: 'Seguros Bolivar',
                type: organization_types_1.OrganizationTypes.ASEGURADORA,
                taxId: '890123456-1',
                email: 'info@segurosbolivar.com',
                phone: '+57 1 234-5678',
                address: 'Calle 72 #10-35, Bogotá'
            },
            {
                name: 'Taller AutoExpert',
                type: organization_types_1.OrganizationTypes.TALLER,
                taxId: '900234567-2',
                email: 'contacto@autoexpert.com',
                phone: '+57 1 345-6789',
                address: 'Carrera 68 #45-23, Medellín'
            },
            {
                name: 'Concesionario Toyota Premium',
                type: organization_types_1.OrganizationTypes.CONCESIONARIA,
                taxId: '910345678-3',
                email: 'ventas@toyotapremium.com',
                phone: '+57 1 456-7890',
                address: 'Autopista Norte Km 18, Bogotá'
            }
        ];
        for (const orgData of organizations) {
            const existingOrg = await this.organizationRepository.findOne({
                where: { name: orgData.name }
            });
            if (!existingOrg) {
                const organization = this.organizationRepository.create(orgData);
                await this.organizationRepository.save(organization);
                console.log(`  ✓ Created organization: ${orgData.name} (${orgData.type})`);
            }
            else {
                console.log(`  - Organization already exists: ${orgData.name}`);
            }
        }
    }
    async createUsers() {
        console.log('👥 Creating test users...');
        const testUsers = [
            {
                firstName: 'Super',
                lastName: 'Administrador',
                email: 'superadmin@vehicular.com',
                password: 'SuperAdmin123!',
                roleName: valid_roles_1.ValidRoles.superadmin,
                organizationName: null
            },
            {
                firstName: 'Admin',
                lastName: 'Sistema',
                email: 'admin@vehicular.com',
                password: 'Admin123!',
                roleName: valid_roles_1.ValidRoles.admin,
                organizationName: null
            },
            {
                firstName: 'María',
                lastName: 'Seguros',
                email: 'maria.seguros@aseguradora.com',
                password: 'Aseguradora123!',
                roleName: valid_roles_1.ValidRoles.aseguradora,
                organizationName: 'Seguros Bolivar'
            },
            {
                firstName: 'Carlos',
                lastName: 'Mecánico',
                email: 'carlos@taller.com',
                password: 'Taller123!',
                roleName: valid_roles_1.ValidRoles.taller,
                organizationName: 'Taller AutoExpert'
            },
            {
                firstName: 'Ana',
                lastName: 'Ventas',
                email: 'ana.ventas@concesionaria.com',
                password: 'Concesionaria123!',
                roleName: valid_roles_1.ValidRoles.concesionaria,
                organizationName: 'Concesionario Toyota Premium'
            },
            {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan.perez@email.com',
                password: 'Consumer123!',
                roleName: valid_roles_1.ValidRoles.consumer,
                organizationName: null
            }
        ];
        for (const userData of testUsers) {
            const existingUser = await this.userRepository.findOne({
                where: { email: userData.email }
            });
            if (!existingUser) {
                const role = await this.roleRepository.findOne({
                    where: { name: userData.roleName }
                });
                if (role) {
                    let organization = null;
                    if (userData.organizationName) {
                        organization = await this.organizationRepository.findOne({
                            where: { name: userData.organizationName }
                        });
                    }
                    const hashedPassword = await bcrypt.hash(userData.password, 10);
                    const user = this.userRepository.create({
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        email: userData.email,
                        password: hashedPassword,
                        roles: [role],
                        organization: organization,
                        isActive: true
                    });
                    await this.userRepository.save(user);
                    console.log(`  ✓ Created user: ${userData.email} (${userData.roleName}${organization ? ` - ${organization.name}` : ''})`);
                }
                else {
                    console.log(`  ⚠️ Role not found for user: ${userData.email}`);
                }
            }
            else {
                console.log(`  - User already exists: ${userData.email}`);
            }
        }
    }
    getRoleDescription(roleName) {
        const descriptions = {
            [valid_roles_1.ValidRoles.superadmin]: 'Super Administrador del sistema con acceso completo',
            [valid_roles_1.ValidRoles.admin]: 'Administrador con permisos de gestión general',
            [valid_roles_1.ValidRoles.aseguradora]: 'Representante de compañía aseguradora',
            [valid_roles_1.ValidRoles.taller]: 'Técnico de taller mecánico autorizado',
            [valid_roles_1.ValidRoles.concesionaria]: 'Representante de concesionaria de vehículos',
            [valid_roles_1.ValidRoles.consumer]: 'Usuario final/consumidor'
        };
        return descriptions[roleName] || `Usuario con rol ${roleName}`;
    }
    async createVehicles() {
        console.log('🚗 Creating test vehicles...');
        const testVehicles = [
            {
                licensePlate: 'ABC123',
                chassisNumber: 'VIN1234567890ABCD',
                location: 'Bogotá, Colombia',
                brand: 'Toyota',
                model: 'Corolla 2022'
            },
            {
                licensePlate: 'XYZ789',
                chassisNumber: 'VIN0987654321EFGH',
                location: 'Medellín, Colombia',
                brand: 'Chevrolet',
                model: 'Aveo 2021'
            },
            {
                licensePlate: 'DEF456',
                chassisNumber: 'VIN1122334455IJKL',
                location: 'Cali, Colombia',
                brand: 'Nissan',
                model: 'Sentra 2023'
            },
            {
                licensePlate: 'GHI789',
                chassisNumber: 'VIN5566778899MNOP',
                location: 'Barranquilla, Colombia',
                brand: 'Hyundai',
                model: 'Accent 2022'
            },
            {
                licensePlate: 'BNA946',
                chassisNumber: 'VIN9988776655QRST',
                location: 'Buenos Aires, Argentina',
                brand: 'Ford',
                model: 'Focus 2023'
            }
        ];
        for (const vehicleData of testVehicles) {
            const existingVehicle = await this.vehicleRepository.findOne({
                where: { licensePlate: vehicleData.licensePlate }
            });
            if (!existingVehicle) {
                const vehicle = this.vehicleRepository.create(vehicleData);
                await this.vehicleRepository.save(vehicle);
                console.log(`  ✓ Created vehicle: ${vehicleData.licensePlate} - ${vehicleData.brand} ${vehicleData.model}`);
            }
            else {
                console.log(`  - Vehicle already exists: ${vehicleData.licensePlate}`);
            }
        }
    }
    async createEvents() {
        console.log('📝 Creating test events...');
        const vehicles = await this.vehicleRepository.find({ take: 4 });
        const organizations = await this.organizationRepository.find();
        if (vehicles.length === 0 || organizations.length === 0) {
            console.log('  ⚠️ No vehicles or organizations found, skipping events creation');
            return;
        }
        const testEvents = [
            {
                kilometers: 15000,
                description: 'Mantenimiento preventivo realizado - Cambio de aceite y filtros',
                eventDate: new Date('2024-01-15'),
                location: 'Taller AutoExpert, Medellín',
                vehicle: vehicles[0],
                organization: organizations[1]
            },
            {
                kilometers: 18500,
                description: 'Inspección técnico-mecánica aprobada',
                eventDate: new Date('2024-03-22'),
                location: 'Centro de Inspección, Bogotá',
                vehicle: vehicles[0],
                organization: organizations[0]
            },
            {
                kilometers: 8200,
                description: 'Entrega de vehículo nuevo - Revisión pre-entrega completada',
                eventDate: new Date('2024-02-10'),
                location: 'Concesionario Toyota Premium',
                vehicle: vehicles[1],
                organization: organizations[2]
            },
            {
                kilometers: 12000,
                description: 'Reparación de sistema de frenos - Cambio de pastillas',
                eventDate: new Date('2024-04-05'),
                location: 'Taller AutoExpert, Medellín',
                vehicle: vehicles[1],
                organization: organizations[1]
            },
            {
                kilometers: 25000,
                description: 'Reclamo de seguro por colisión menor - Evaluación completada',
                eventDate: new Date('2024-05-12'),
                location: 'Seguros Bolivar, Bogotá',
                vehicle: vehicles[2],
                organization: organizations[0]
            }
        ];
        for (const eventData of testEvents) {
            const existingEvent = await this.eventRepository.findOne({
                where: {
                    description: eventData.description,
                    vehicle: { id: eventData.vehicle.id }
                }
            });
            if (!existingEvent) {
                const event = this.eventRepository.create(eventData);
                await this.eventRepository.save(event);
                console.log(`  ✓ Created event: ${eventData.description.substring(0, 50)}...`);
            }
            else {
                console.log(`  - Event already exists for vehicle ${eventData.vehicle.licensePlate}`);
            }
        }
    }
    async clearDatabase() {
        console.log('🗑️ Clearing database...');
        await this.eventRepository.delete({});
        await this.vehicleRepository.delete({});
        await this.userRepository.delete({});
        await this.organizationRepository.delete({});
        await this.roleRepository.delete({});
        console.log('✅ Database cleared!');
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(2, (0, typeorm_1.InjectRepository)(organization_entity_1.Organization)),
    __param(3, (0, typeorm_1.InjectRepository)(vehicle_entity_1.Vehicle)),
    __param(4, (0, typeorm_1.InjectRepository)(event_entity_1.Event)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _d : Object, typeof (_e = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _e : Object])
], SeedService);
//# sourceMappingURL=seed.service.js.map