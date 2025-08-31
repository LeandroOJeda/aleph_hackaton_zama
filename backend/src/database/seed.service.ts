import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { Role } from '../auth/entities/role.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { Event } from '../events/entities/event.entity';
import { OrganizationTypes } from '../organizations/interfaces/organization-types';
import { ValidRoles } from '../auth/interfaces/valid_roles';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async seed() {
    console.log('🌱 Starting database seeding...');

    // Crear roles
    await this.createRoles();
    
    // Crear organizaciones
    await this.createOrganizations();
    
    // Crear usuarios de prueba
    await this.createUsers();

    // Crear vehículos de prueba
    await this.createVehicles();

    // Crear eventos de prueba
    await this.createEvents();

    console.log('✅ Database seeding completed!');
  }

  private async createRoles() {
    console.log('📋 Creating roles...');
    
    const rolesToCreate = Object.values(ValidRoles);
    
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
      } else {
        console.log(`  - Role already exists: ${roleName}`);
      }
    }
  }

  private async createOrganizations() {
    console.log('🏢 Creating organizations...');
    
    const organizations = [
      {
        name: 'Seguros Bolivar',
        type: OrganizationTypes.ASEGURADORA,
        taxId: '890123456-1',
        email: 'info@segurosbolivar.com',
        phone: '+57 1 234-5678',
        address: 'Calle 72 #10-35, Bogotá'
      },
      {
        name: 'Taller AutoExpert',
        type: OrganizationTypes.TALLER,
        taxId: '900234567-2',
        email: 'contacto@autoexpert.com',
        phone: '+57 1 345-6789',
        address: 'Carrera 68 #45-23, Medellín'
      },
      {
        name: 'Concesionario Toyota Premium',
        type: OrganizationTypes.CONCESIONARIA,
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
      } else {
        console.log(`  - Organization already exists: ${orgData.name}`);
      }
    }
  }

  private async createUsers() {
    console.log('👥 Creating test users...');
    
    const testUsers = [
      {
        firstName: 'Super',
        lastName: 'Administrador',
        email: 'superadmin@vehicular.com',
        password: 'SuperAdmin123!',
        roleName: ValidRoles.superadmin,
        organizationName: null
      },
      {
        firstName: 'Admin',
        lastName: 'Sistema',
        email: 'admin@vehicular.com',
        password: 'Admin123!',
        roleName: ValidRoles.admin,
        organizationName: null
      },
      {
        firstName: 'María',
        lastName: 'Seguros',
        email: 'maria.seguros@aseguradora.com',
        password: 'Aseguradora123!',
        roleName: ValidRoles.aseguradora,
        organizationName: 'Seguros Bolivar'
      },
      {
        firstName: 'Carlos',
        lastName: 'Mecánico',
        email: 'carlos@taller.com',
        password: 'Taller123!',
        roleName: ValidRoles.taller,
        organizationName: 'Taller AutoExpert'
      },
      {
        firstName: 'Ana',
        lastName: 'Ventas',
        email: 'ana.ventas@concesionaria.com',
        password: 'Concesionaria123!',
        roleName: ValidRoles.concesionaria,
        organizationName: 'Concesionario Toyota Premium'
      },
      {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@email.com',
        password: 'Consumer123!',
        roleName: ValidRoles.consumer,
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
        } else {
          console.log(`  ⚠️ Role not found for user: ${userData.email}`);
        }
      } else {
        console.log(`  - User already exists: ${userData.email}`);
      }
    }
  }

  private getRoleDescription(roleName: string): string {
    const descriptions = {
      [ValidRoles.superadmin]: 'Super Administrador del sistema con acceso completo',
      [ValidRoles.admin]: 'Administrador con permisos de gestión general',
      [ValidRoles.aseguradora]: 'Representante de compañía aseguradora',
      [ValidRoles.taller]: 'Técnico de taller mecánico autorizado',
      [ValidRoles.concesionaria]: 'Representante de concesionaria de vehículos',
      [ValidRoles.consumer]: 'Usuario final/consumidor'
    };
    
    return descriptions[roleName] || `Usuario con rol ${roleName}`;
  }

  private async createVehicles() {
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
      } else {
        console.log(`  - Vehicle already exists: ${vehicleData.licensePlate}`);
      }
    }
  }

  private async createEvents() {
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
        organization: organizations[1] // Taller
      },
      {
        kilometers: 18500,
        description: 'Inspección técnico-mecánica aprobada',
        eventDate: new Date('2024-03-22'),
        location: 'Centro de Inspección, Bogotá',
        vehicle: vehicles[0],
        organization: organizations[0] // Aseguradora
      },
      {
        kilometers: 8200,
        description: 'Entrega de vehículo nuevo - Revisión pre-entrega completada',
        eventDate: new Date('2024-02-10'),
        location: 'Concesionario Toyota Premium',
        vehicle: vehicles[1],
        organization: organizations[2] // Concesionaria
      },
      {
        kilometers: 12000,
        description: 'Reparación de sistema de frenos - Cambio de pastillas',
        eventDate: new Date('2024-04-05'),
        location: 'Taller AutoExpert, Medellín',
        vehicle: vehicles[1],
        organization: organizations[1] // Taller
      },
      {
        kilometers: 25000,
        description: 'Reclamo de seguro por colisión menor - Evaluación completada',
        eventDate: new Date('2024-05-12'),
        location: 'Seguros Bolivar, Bogotá',
        vehicle: vehicles[2],
        organization: organizations[0] // Aseguradora
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
      } else {
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
}