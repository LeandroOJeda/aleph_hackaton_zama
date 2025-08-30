"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const seed_service_1 = require("./seed.service");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const seedService = app.get(seed_service_1.SeedService);
    try {
        const args = process.argv.slice(2);
        if (args.includes('--clear')) {
            await seedService.clearDatabase();
        }
        else {
            await seedService.seed();
        }
    }
    catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
    finally {
        await app.close();
        process.exit(0);
    }
}
bootstrap();
//# sourceMappingURL=seed.command.js.map