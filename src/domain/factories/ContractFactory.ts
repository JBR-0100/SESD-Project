import { RentalContract } from '../entities/RentalContract';
import { Customer } from '../entities/Customer';
import { Vehicle } from '../entities/Vehicle';
import { InsurancePolicy } from '../entities/InsurancePolicy';
import { PricingStrategy } from '../patterns/strategy/PricingStrategy.interface';
import { ContractStatus } from '../types/enums';

export class ContractFactory {
    static createContract(
        customer: Customer,
        vehicle: Vehicle,
        startDate: Date,
        days: number,
        insurance: InsurancePolicy,
        strategy: PricingStrategy,
        contractId?: string,
        status?: ContractStatus,
        totalAmount?: number
    ): RentalContract {
        return new RentalContract(
            customer,
            vehicle,
            startDate,
            days,
            insurance,
            strategy,
            contractId,
            status,
            totalAmount
        );
    }
}
