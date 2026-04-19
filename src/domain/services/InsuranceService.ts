import { InsurancePolicy } from '../entities/InsurancePolicy';
import { InsuranceTier, VehicleType } from '../types/enums';

export class InsuranceService {
    static getPolicy(tier: InsuranceTier, vehicleType: VehicleType): InsurancePolicy {
        let dailyRate = 15;
        let deductible = 1000;
        let coverage = 5000;

        // Business logic for insurance selection
        if (tier === InsuranceTier.PREMIUM) {
            dailyRate = 25;
            deductible = 500;
            coverage = 20000;
        } else if (tier === InsuranceTier.FULL_COVERAGE) {
            dailyRate = 40;
            deductible = 0;
            coverage = 100000;
        }

        // Special rules for Trucks
        if (vehicleType === VehicleType.TRUCK) {
            dailyRate += 10;
            coverage += 10000;
        }

        return new InsurancePolicy(tier, dailyRate, deductible, coverage);
    }
}
