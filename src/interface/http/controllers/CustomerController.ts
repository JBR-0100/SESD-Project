import { Request, Response, NextFunction } from 'express';
import { CustomerRepository } from '../../../infrastructure/repositories/CustomerRepository';

export class CustomerController {
    private customerRepo: CustomerRepository;

    constructor() {
        this.customerRepo = new CustomerRepository();
    }

    // GET /customers — retrieve all registered users
    getAllCustomers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const customers = await this.customerRepo.findAll();
            const responseData = customers.map(c => ({
                id: c.getCustomerId(),
                firstName: (c as any).firstName, // Accessing private for demo serialization
                lastName: (c as any).lastName,
                email: c.getEmail(),
                tier: c.getLoyaltyTier(),
                points: c.getLoyaltyPoints(),
                isBlocked: c.isBlocked(),
                role: c.getRole()
            }));
            res.status(200).json({ status: 'success', data: responseData });
        } catch (error) {
            next(error);
        }
    };
}
