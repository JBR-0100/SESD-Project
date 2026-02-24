import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ 
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Starting database seeding...');

    // 1. Populate Enums/Lookup Tables
    const vehicleTypes = ['CAR', 'TRUCK', 'ELECTRIC_VEHICLE'];
    const vehicleStates = ['AVAILABLE', 'RENTED', 'MAINTENANCE'];
    const loyaltyTiers = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'];
    const contractStatuses = ['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED'];
    const insuranceTiers = ['BASIC', 'STANDARD', 'PREMIUM'];
    const maintenanceStatuses = ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED'];

    console.log('   Populating lookup tables...');
    for (const name of vehicleTypes) await prisma.vehicleTypeEnum.upsert({ where: { name }, update: {}, create: { name } });
    for (const name of vehicleStates) await prisma.vehicleStateEnum.upsert({ where: { name }, update: {}, create: { name } });
    for (const name of loyaltyTiers) await prisma.loyaltyTierEnum.upsert({ where: { name }, update: {}, create: { name } });
    for (const name of contractStatuses) await prisma.contractStatusEnum.upsert({ where: { name }, update: {}, create: { name } });
    for (const name of insuranceTiers) await prisma.insuranceTierEnum.upsert({ where: { name }, update: {}, create: { name } });
    for (const name of maintenanceStatuses) await prisma.maintenanceStatusEnum.upsert({ where: { name }, update: {}, create: { name } });

    // 2. Create Users
    console.log('   Creating test users...');
    const passwordHash = await bcrypt.hash('password123', 10);

    const admin = await prisma.customer.upsert({
        where: { email: 'admin@driveflow.com' },
        update: {},
        create: {
            email: 'admin@driveflow.com',
            firstName: 'DriveFlow',
            lastName: 'Admin',
            phone: '555-0100',
            passwordHash,
            role: 'FLEET_MANAGER',
            loyaltyTier: 'PLATINUM'
        }
    });

    const customer = await prisma.customer.upsert({
        where: { email: 'test@example.com' },
        update: {},
        create: {
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            phone: '555-0199',
            passwordHash,
            role: 'CUSTOMER',
            loyaltyTier: 'BRONZE'
        }
    });

    // 3. Create Vehicles
    console.log('   Creating vehicles...');
    const vehiclesData = [
        { make: 'Tesla', model: 'Model 3', year: 2023, licensePlate: 'EV-101', dailyRate: 120.0, state: 'AVAILABLE', type: 'ELECTRIC_VEHICLE', batteryCapacityKwh: 75, rangeKm: 500, chargerType: 'TYPE2' },
        { make: 'Tesla', model: 'Model Y', year: 2024, licensePlate: 'EV-102', dailyRate: 140.0, state: 'MAINTENANCE', type: 'ELECTRIC_VEHICLE', batteryCapacityKwh: 82, rangeKm: 530, chargerType: 'TYPE2', lastServiceMileage: 1200, mileageKm: 5200 },
        { make: 'Toyota', model: 'Camry', year: 2022, licensePlate: 'CAR-201', dailyRate: 65.0, state: 'AVAILABLE', type: 'CAR', numDoors: 4, transmission: 'AUTO', fuelType: 'HYBRID', seatingCapacity: 5 },
        { make: 'Honda', model: 'Civic', year: 2021, licensePlate: 'CAR-202', dailyRate: 55.0, state: 'RENTED', type: 'CAR', numDoors: 4, transmission: 'MANUAL', fuelType: 'PETROL', seatingCapacity: 5 },
        { make: 'Ford', model: 'F-150', year: 2022, licensePlate: 'TRK-301', dailyRate: 95.0, state: 'AVAILABLE', type: 'TRUCK', payloadCapacityTons: 1.5, truckClass: 'LIGHT', hasRefrigeration: false },
        { make: 'Volvo', model: 'FH16', year: 2020, licensePlate: 'TRK-302', dailyRate: 250.0, state: 'AVAILABLE', type: 'TRUCK', payloadCapacityTons: 25.0, truckClass: 'HEAVY', hasRefrigeration: true },
        { make: 'Rivian', model: 'R1T', year: 2023, licensePlate: 'EV-301', dailyRate: 180.0, state: 'AVAILABLE', type: 'ELECTRIC_VEHICLE', batteryCapacityKwh: 135, rangeKm: 600, chargerType: 'CCS' },
        { make: 'BMW', model: 'i4', year: 2024, licensePlate: 'EV-401', dailyRate: 160.0, state: 'AVAILABLE', type: 'ELECTRIC_VEHICLE', batteryCapacityKwh: 84, rangeKm: 590, chargerType: 'TYPE2' },
    ];

    for (const v of vehiclesData) {
        await prisma.vehicle.upsert({
            where: { licensePlate: v.licensePlate },
            update: {},
            create: v
        });
    }

    console.log('✅ Database seeding complete!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
