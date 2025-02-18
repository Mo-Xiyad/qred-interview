import { PrismaClient } from '@prisma/client';
import { CompanyRepo as CompanyRepository } from '../repo/company.repo';
import { CacheService } from '../services/cache.service';
import { CompanyService } from '../services/company.service';
export class CompanyFactory {
  static create(prisma: PrismaClient) {
    const repository = new CompanyRepository(prisma);
    return new CompanyService(repository, new CacheService());
  }
}
