import { Router } from 'express';
import authRoutes from './authRoutes';
import rentalRoutes from './rentalRoutes';
import vehicleRoutes from './vehicleRoutes';
import customerRoutes from './customerRoutes';
import healthRoutes from './healthRoutes';

const router = Router();


router.use('/auth', authRoutes);
router.use('/rentals', rentalRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/customers', customerRoutes);
router.use('/health', healthRoutes);

export default router;
