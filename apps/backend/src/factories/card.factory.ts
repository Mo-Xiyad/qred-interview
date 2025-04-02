import { PrismaClient } from '@prisma/client';
import { CardRepo as CardRepository } from '../repo/card.repo';
import { CacheService } from '../services/cache.service';
import { CardService } from '../services/card.service';

export class CardFactory {
  static create(prisma: PrismaClient) {
    const repository = new CardRepository(prisma);
    const cacheService = CacheService.getInstance();
    return new CardService(repository, cacheService);
  }
}
