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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../auth/entities/user.entity");
const role_entity_1 = require("../auth/entities/role.entity");
const valid_roles_1 = require("../auth/interfaces/valid_roles");
const bcrypt = require("bcrypt");
let SeedService = class SeedService {
    constructor(userRepository, roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }
    async seed() {
        console.log('🌱 Starting database seeding...');
        await this.createRoles();
        await this.createUsers();
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
    async createUsers() {
        console.log('👥 Creating test users...');
        const testUsers = [
            {
                firstName: 'Super',
                lastName: 'Administrador',
                email: 'superadmin@vehicular.com',
                password: 'SuperAdmin123!',
                roleName: valid_roles_1.ValidRoles.superadmin
            },
            {
                firstName: 'Admin',
                lastName: 'Sistema',
                email: 'admin@vehicular.com',
                password: 'Admin123!',
                roleName: valid_roles_1.ValidRoles.admin
            },
            {
                firstName: 'María',
                lastName: 'Seguros',
                email: 'maria.seguros@aseguradora.com',
                password: 'Aseguradora123!',
                roleName: valid_roles_1.ValidRoles.aseguradora
            },
            {
                firstName: 'Carlos',
                lastName: 'Mecánico',
                email: 'carlos@taller.com',
                password: 'Taller123!',
                roleName: valid_roles_1.ValidRoles.taller
            },
            {
                firstName: 'Ana',
                lastName: 'Ventas',
                email: 'ana.ventas@concesionaria.com',
                password: 'Concesionaria123!',
                roleName: valid_roles_1.ValidRoles.concesionaria
            },
            {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan.perez@email.com',
                password: 'Consumer123!',
                roleName: valid_roles_1.ValidRoles.consumer
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
                    const hashedPassword = await bcrypt.hash(userData.password, 10);
                    const user = this.userRepository.create({
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        email: userData.email,
                        password: hashedPassword,
                        roles: [role],
                        isActive: true
                    });
                    await this.userRepository.save(user);
                    console.log(`  ✓ Created user: ${userData.email} (${userData.roleName})`);
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
    async clearDatabase() {
        console.log('🗑️ Clearing database...');
        await this.userRepository.delete({});
        await this.roleRepository.delete({});
        console.log('✅ Database cleared!');
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SeedService);
//# sourceMappingURL=seed.service.js.map