import { ContractRepository } from '../../infrastructure/repositories/ContractRepository';
import { CustomerRepository } from '../../infrastructure/repositories/CustomerRepository';
import { VehicleRepository } from '../../infrastructure/repositories/VehicleRepository';
import { RentalContract } from '../../domain/entities/RentalContract';
import { InsuranceService } from '../../domain/services/InsuranceService';
import { PricingEngine } from '../../domain/services/PricingEngine';
import { ContractFactory } from '../../domain/factories/ContractFactory';
import { InsuranceTier } from '../../domain/types/enums';

import { Logger } from '../../infrastructure/Logger';
import { AppError, VehicleNotAvailableError } from '../../domain/errors';
import { EventBus, DomainEvents } from '../../infrastructure/events/EventBus';

export class RentalService {
    private contractRepo: ContractRepository;
    private customerRepo: CustomerRepository;
    private vehicleRepo: VehicleRepository;

    constructor() {
        this.contractRepo = new ContractRepository();
        this.customerRepo = new CustomerRepository();
        this.vehicleRepo = new VehicleRepository();
    }

    async createRentalDraft(
        customerId: string,
        vehicleId: string,
        startDate: Date,
        durationDays: number,
        insuranceTier: InsuranceTier
    ): Promise<RentalContract> {
        Logger.info('Creating rental draft', { customerId, vehicleId, startDate, durationDays });

        const customer = await this.customerRepo.findByEmail(customerId);
        if (!customer) throw new AppError(`Customer with ID ${customerId} not found.`, 404);

        const vehicle = await this.vehicleRepo.findById(vehicleId);
        if (!vehicle) throw new AppError(`Vehicle with ID ${vehicleId} not found.`, 404);

        if (vehicle.getState().getStateName() !== 'AVAILABLE') {
            throw new VehicleNotAvailableError(`Vehicle ${vehicleId} is currently ${vehicle.getState().getStateName()}`);
        }

        const insurance = InsuranceService.getPolicy(insuranceTier, vehicle.getVehicleType());
        const strategy = PricingEngine.selectStrategy(durationDays, customer.getLoyaltyTier());

        const contract = ContractFactory.createContract(
            customer,
            vehicle,
            startDate,
            durationDays,
            insurance,
            strategy
        );

        await this.contractRepo.save(contract);
        return contract;
    }

    async confirmRental(contractId: string): Promise<RentalContract> {
        Logger.info('Confirming rental', { contractId });
        
        const contract = await this.contractRepo.findById(contractId);
        if (!contract) throw new AppError('Contract not found', 404);

        contract.confirm();

        await this.contractRepo.save(contract);
        await this.vehicleRepo.save(contract.getVehicle());

        EventBus.publish(DomainEvents.RENTAL_CREATED, {
            contractId: contract.getContractId(),
            customerEmail: contract.getCustomer().getEmail(),
            totalAmount: contract.getTotalAmount()
        });

        return contract;
    }

    async activateRental(contractId: string): Promise<RentalContract> {
        Logger.info('Activating rental (Pickup)', { contractId });

        const contract = await this.contractRepo.findById(contractId);
        if (!contract) throw new AppError('Contract not found', 404);

        contract.activate();

        await this.contractRepo.save(contract);
        await this.vehicleRepo.save(contract.getVehicle());

        return contract;
    }

    async completeRental(contractId: string, returnDate: Date, mileageAdded: number): Promise<RentalContract> {
        Logger.info('Completing rental', { contractId, mileageAdded });

        const contract = await this.contractRepo.findById(contractId);
        if (!contract) throw new AppError('Contract not found', 404);

        contract.complete(returnDate, mileageAdded);

        await this.contractRepo.save(contract);
        await this.vehicleRepo.save(contract.getVehicle());
        await this.customerRepo.save(contract.getCustomer());

        return contract;
    }

    async rentVehicle(
        customerId: string,
        vehicleId: string,
        startDate: Date,
        durationDays: number,
        insuranceTier: InsuranceTier
    ): Promise<RentalContract> {
        const draft = await this.createRentalDraft(customerId, vehicleId, startDate, durationDays, insuranceTier);
        return this.confirmRental(draft.getContractId());
    }

    async getReservedRentals(): Promise<RentalContract[]> {
        return this.contractRepo.findAllWithStatus('CONFIRMED');
    }
}
