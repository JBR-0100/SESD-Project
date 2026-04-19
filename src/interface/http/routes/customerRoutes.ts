import { Router } from 'express';
import { CustomerController } from '../controllers/CustomerController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';

const router = Router();
const controller = new CustomerController();

// GET /customers — Retrieve all customers (Fleet Manager only)
router.get(
    '/',
    authMiddleware,
    roleMiddleware('FLEET_MANAGER'),
    controller.getAllCustomers
);

export default router;
