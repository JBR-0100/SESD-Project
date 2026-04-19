import { PrismaClient } from '@prisma/client';
import { RentalContract } from '../../domain/entities/RentalContract';
import { PrismaService } from '../PrismaService';
import { ContractMapper } from '../mappers/ContractMapper';

export class ContractRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = PrismaService.getInstance();
    }

    async save(contract: RentalContract): Promise<void> {
        const data = {
            contractId: contract.getContractId(),
            customerId: contract.getCustomer().getCustomerId(),
            vehicleId: contract.getVehicle().getVehicleId(),
            status: contract.getStatus().toString(),
            startDate: contract.getStartDate(),
            endDate: contract.getEndDate(),
            basePrice: contract.getBasePrice(),
            insuranceTotal: contract.getInsuranceTotal(),
            totalAmount: contract.getTotalAmount(),
            // Optimistic Locking Version
            version: 1
        };

        // Use transaction for double-booking check
        await this.prisma.$transaction(async (tx) => {
            // 1. Check for overlapping active contracts for this vehicle
            const overlapping = await tx.rentalContract.findFirst({
                where: {
                    vehicleId: data.vehicleId,
                    status: { in: ['CONFIRMED', 'ACTIVE'] },
                    NOT: { contractId: data.contractId }, // Ignore current contract if updating
                    OR: [
                        {
                            startDate: { lte: data.endDate },
                            endDate: { gte: data.startDate }
                        }
                    ]
                }
            });

            if (overlapping) {
                console.error(`Double booking prevented for vehicle ${data.vehicleId}`);
                throw new Error(`Vehicle ${data.vehicleId} is already booked for these dates.`);
            }

            // 2. Insert if safe
            await tx.rentalContract.upsert({
                where: { contractId: data.contractId },
                update: data,
                create: data
            });
        });
    }

    async findById(id: string): Promise<RentalContract | null> {
        const contract = await this.prisma.rentalContract.findUnique({
            where: { contractId: id },
            include: {
                customer: true,
                vehicle: true,
                insurancePolicy: true
            }
        });

        if (!contract) return null;
        return ContractMapper.toDomain(contract as any);
    }

    async findAllWithStatus(status: string): Promise<RentalContract[]> {
        const contracts = await this.prisma.rentalContract.findMany({
            where: { status },
            include: {
                customer: true,
                vehicle: true,
                insurancePolicy: true
            },
            orderBy: { startDate: 'asc' }
        });

        return contracts.map(c => ContractMapper.toDomain(c as any));
    }
}
