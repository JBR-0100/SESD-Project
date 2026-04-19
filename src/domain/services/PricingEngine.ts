import { PricingStrategy } from '../patterns/strategy/PricingStrategy.interface';
import { StandardPricingStrategy } from '../patterns/strategy/StandardPricingStrategy';
import { LoyaltyPricingStrategy } from '../patterns/strategy/LoyaltyPricingStrategy';
import { SeasonalSurgePricingStrategy } from '../patterns/strategy/SeasonalSurgePricingStrategy';
import { LoyaltyTier } from '../types/enums';

export class PricingEngine {
    static selectStrategy(days: number, loyaltyTier: LoyaltyTier): PricingStrategy {
        // Simple logic to select strategy
        if (loyaltyTier === LoyaltyTier.GOLD || loyaltyTier === LoyaltyTier.PLATINUM) {
            return new LoyaltyPricingStrategy();
        }

        // Logic for seasonal surge (could be more complex)
        const isHighSeason = new Date().getMonth() >= 5 && new Date().getMonth() <= 8;
        if (isHighSeason) {
            return new SeasonalSurgePricingStrategy();
        }

        return new StandardPricingStrategy();
    }
}
