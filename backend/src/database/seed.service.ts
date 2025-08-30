import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { Role } from '../auth/entities/role.entity';
import { ValidRoles } from '../auth/interfaces/valid_roles';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async seed() {
    console.log('🌱 Starting database seeding...');

    // Crear roles
    await this.createRoles();
    
    // Crear usuarios de prueba
    await this.createUsers();

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

  private async createUsers() {
    console.log('👥 Creating test users...');
    
    const testUsers = [
      {
        firstName: 'Super',
        lastName: 'Administrador',
        email: 'superadmin@vehicular.com',
        password: 'SuperAdmin123!',
        roleName: ValidRoles.superadmin
      },
      {
        firstName: 'Admin',
        lastName: 'Sistema',
        email: 'admin@vehicular.com',
        password: 'Admin123!',
        roleName: ValidRoles.admin
      },
      {
        firstName: 'María',
        lastName: 'Seguros',
        email: 'maria.seguros@aseguradora.com',
        password: 'Aseguradora123!',
        roleName: ValidRoles.aseguradora
      },
      {
        firstName: 'Carlos',
        lastName: 'Mecánico',
        email: 'carlos@taller.com',
        password: 'Taller123!',
        roleName: ValidRoles.taller
      },
      {
        firstName: 'Ana',
        lastName: 'Ventas',
        email: 'ana.ventas@concesionaria.com',
        password: 'Concesionaria123!',
        roleName: ValidRoles.concesionaria
      },
      {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@email.com',
        password: 'Consumer123!',
        roleName: ValidRoles.consumer
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

  async clearDatabase() {
    console.log('🗑️ Clearing database...');
    
    await this.userRepository.delete({});
    await this.roleRepository.delete({});
    
    console.log('✅ Database cleared!');
  }
}