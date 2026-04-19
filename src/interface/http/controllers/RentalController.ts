import { Request, Response, NextFunction } from 'express';
import { RentalService } from '../../../application/services/RentalService';
import { InsuranceTier } from '../../../domain/types/enums';

export class RentalController {
    private rentalService: RentalService;

    constructor() {
        this.rentalService = new RentalService();
    }

    createRental = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { customerId, vehicleId, startDate, days, insuranceTier } = req.body;
            const start = new Date(startDate);
            const tier = insuranceTier as InsuranceTier;

            const contract = await this.rentalService.rentVehicle(
                customerId, vehicleId, start, days, tier
            );

            res.status(201).json({ status: 'success', data: contract });
        } catch (error) {
            next(error);
        }
    };

    confirmRental = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const contractId = String(req.params['contractId']);
            const contract = await this.rentalService.confirmRental(contractId);
            res.status(200).json({ status: 'success', data: contract });
        } catch (error) {
            next(error);
        }
    };

    activateRental = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const contractId = String(req.params['contractId']);
            const contract = await this.rentalService.activateRental(contractId);
            res.status(200).json({ status: 'success', data: contract });
        } catch (error) {
            next(error);
        }
    };

    completeRental = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const contractId = String(req.params['contractId']);
            const { returnDate, mileageAdded } = req.body;
            const contract = await this.rentalService.completeRental(
                contractId, new Date(returnDate), Number(mileageAdded)
            );
            res.status(200).json({ status: 'success', data: contract });
        } catch (error) {
            next(error);
        }
    };

    getReservedRentals = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const reservations = await this.rentalService.getReservedRentals();
            res.status(200).json({ status: 'success', data: reservations });
        } catch (error) {
            next(error);
        }
    };
}
