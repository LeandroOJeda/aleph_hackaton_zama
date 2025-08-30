import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeedService } from './seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedService = app.get(SeedService);

  try {
    // Obtener argumentos de comando
    const args = process.argv.slice(2);
    
    if (args.includes('--clear')) {
      await seedService.clearDatabase();
    } else {
      await seedService.seed();
    }
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await app.close();
    process.exit(0);
  }
}

bootstrap();