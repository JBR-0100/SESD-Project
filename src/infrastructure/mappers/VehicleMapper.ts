import { Vehicle as PrismaVehicle } from '@prisma/client';
import { Vehicle } from '../../domain/entities/Vehicle';
import { VehicleType } from '../../domain/types/enums';
import { VehicleFactory } from '../../domain/factories/VehicleFactory';
import { StateMapper } from '../../domain/patterns/state/StateMapper';

export class VehicleMapper {
    static toDomain(prismaVehicle: PrismaVehicle): Vehicle {
        let type: VehicleType;

        // Map string type to Enum
        switch (prismaVehicle.type) {
            case 'CAR': type = VehicleType.CAR; break;
            case 'TRUCK': type = VehicleType.TRUCK; break;
            case 'ELECTRIC_VEHICLE': type = VehicleType.ELECTRIC_VEHICLE; break;
            default: throw new Error(`Unknown vehicle type: ${prismaVehicle.type}`);
        }

        const data: any = {
            make: prismaVehicle.make,
            model: prismaVehicle.model,
            year: prismaVehicle.year,
            licensePlate: prismaVehicle.licensePlate,
            dailyRate: prismaVehicle.dailyRate,
            mileageKm: prismaVehicle.mileageKm, // Include mileage in data
            // Specific fields
            numDoors: prismaVehicle.numDoors,
            transmission: prismaVehicle.transmission,
            fuelType: prismaVehicle.fuelType,
            seatingCapacity: prismaVehicle.seatingCapacity,
            payloadCapacityTons: prismaVehicle.payloadCapacityTons,
            truckClass: prismaVehicle.truckClass,
            hasRefrigeration: prismaVehicle.hasRefrigeration,
            batteryCapacityKwh: prismaVehicle.batteryCapacityKwh,
            rangeKm: prismaVehicle.rangeKm,
            chargerType: prismaVehicle.chargerType
        };

        const initialState = StateMapper.fromString(prismaVehicle.state);
        
        return VehicleFactory.createVehicle(
            type, 
            data, 
            prismaVehicle.vehicleId, 
            initialState
        );
    }
}
