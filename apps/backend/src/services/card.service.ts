import { Transaction } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { CardRepo } from '../repo/card.repo';
import { CacheService } from './cache.service';

export class CardService {
  private cacheKeyPfix = 'card:spend:';

  constructor(
    private repo: CardRepo,
    private cacheService: CacheService
  ) {}

  async getCardsById(companyId: number, userId: number) {
    return this.repo.getCardsById(companyId, userId);
  }

  async getCardSpendingDetails(cardId: number) {
    const cacheKey = `${this.cacheKeyPfix}${cardId}:details`;
    const cached = await this.cacheService.get<{
      spendLimit: number;
      remainingSpend: number;
      totalSpent: number;
    }>(cacheKey);

    if (cached !== null) return cached;

    const details = await this.repo.getCardSpendingDetails(cardId);
    console.log(details);

    if (!details) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Card not found'
      });
    }

    await this.cacheService.set(cacheKey, details, 300);
    return details;
  }

  async getCardTransactions(cardId: number) {
    const cacheKey = `${this.cacheKeyPfix}${cardId}:transactions`;
    const cached = await this.cacheService.get<{
      transactions: Transaction[];
      total: number;
    }>(cacheKey);

    if (cached !== null) return cached;

    const card = await this.repo.getCardById(cardId);
    if (!card) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Card not found'
      });
    }

    const result = await this.repo.getCardTransactions(cardId);

    await this.cacheService.set(cacheKey, result, 60);
    return result;
  }
}
