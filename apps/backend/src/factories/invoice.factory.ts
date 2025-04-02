import { PrismaClient } from '@prisma/client';
import { InvoiceRepo as InvoiceRepository } from '../repo/invoice.repo';
import { CacheService } from '../services/cache.service';
import { InvoiceService } from '../services/invoice.service';

export class InvoiceFactory {
  static create(prisma: PrismaClient) {
    const repository = new InvoiceRepository(prisma);
    const cacheService = CacheService.getInstance();
    return new InvoiceService(repository, cacheService);
  }
}
