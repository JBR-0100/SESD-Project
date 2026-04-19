import { AvailableState } from './AvailableState';
import { ReservedState } from './ReservedState';
import { RentedState } from './RentedState';
import { MaintenanceState } from './MaintenanceState';
import { RetiredState } from './RetiredState';
import { VehicleState } from './VehicleState.interface';

export class StateMapper {
    static fromString(stateName: string): VehicleState {
        switch (stateName.toUpperCase()) {
            case 'AVAILABLE':
                return new AvailableState();
            case 'RESERVED':
                return new ReservedState();
            case 'RENTED':
                return new RentedState();
            case 'MAINTENANCE':
                return new MaintenanceState();
            case 'RETIRED':
                return new RetiredState();
            default:
                return new AvailableState();
        }
    }
}
