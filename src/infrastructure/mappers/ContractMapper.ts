import { RentalContract as PrismaContract, Customer as PrismaCustomer, Vehicle as PrismaVehicle, InsurancePolicy as PrismaInsurance } from '@prisma/client';
import { RentalContract } from '../../domain/entities/RentalContract';
import { ContractFactory } from '../../domain/factories/ContractFactory';
import { VehicleMapper } from './VehicleMapper';
import { Customer } from '../../domain/entities/Customer';
import { InsurancePolicy } from '../../domain/entities/InsurancePolicy';
import { StandardPricingStrategy } from '../../domain/patterns/strategy/StandardPricingStrategy';
import { ContractStatus, InsuranceTier, LoyaltyTier } from '../../domain/types/enums';

export class ContractMapper {
    static toDomain(
        prismaContract: PrismaContract & {
            customer: PrismaCustomer;
            vehicle: PrismaVehicle;
            insurancePolicy: PrismaInsurance | null;
        }
    ): RentalContract {
        const customer = Customer.restore(
            prismaContract.customer.customerId,
            prismaContract.customer.firstName,
            prismaContract.customer.lastName,
            prismaContract.customer.email,
            prismaContract.customer.phone,
            prismaContract.customer.loyaltyTier as LoyaltyTier,
            prismaContract.customer.loyaltyPoints,
            prismaContract.customer.isBlacklisted,
            prismaContract.customer.passwordHash,
            prismaContract.customer.role
        );

        const vehicle = VehicleMapper.toDomain(prismaContract.vehicle);

        let insurance: InsurancePolicy;
        if (prismaContract.insurancePolicy) {
            insurance = new InsurancePolicy(
                prismaContract.insurancePolicy.tier as InsuranceTier,
                prismaContract.insurancePolicy.dailyPremium,
                prismaContract.insurancePolicy.deductibleAmount,
                prismaContract.insurancePolicy.maxCoverageAmount,
                prismaContract.insurancePolicy.policyId
            );
        } else {
            insurance = new InsurancePolicy(InsuranceTier.BASIC, 15, 500, 10000);
        }

        const strategy = new StandardPricingStrategy();

        const diffTime = Math.abs(prismaContract.endDate.getTime() - prismaContract.startDate.getTime());
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return ContractFactory.createContract(
            customer,
            vehicle,
            prismaContract.startDate,
            days,
            insurance,
            strategy,
            prismaContract.contractId,
            prismaContract.status as ContractStatus,
            prismaContract.totalAmount
        );
    }
}
