import { Company } from '@prisma/client';
import { ICompanyRepo } from '../interfaces/repository.interface';
import { CacheService } from './cache.service';

export class CompanyService {
  private cacheKeyPfix = 'company:';

  constructor(
    private repo: ICompanyRepo<Company>,
    private cacheService: CacheService
  ) {}

  async getCompanies() {
    const cacheKey = `${this.cacheKeyPfix}list`;
    const cached = await this.cacheService.get<Company[]>(cacheKey); //  check for type

    if (cached) {
      return cached;
    }

    const companies = await this.repo.findAll();
    await this.cacheService.set(cacheKey, companies);
    return companies;
  }

  async getCompanyById(id: number) {
    const cacheKey = `${this.cacheKeyPfix}${id}`;
    const cached = await this.cacheService.get<Company>(cacheKey);

    if (cached) {
      return cached;
    }

    const company = await this.repo.findById(id);
    if (!company) {
      throw new Error('Company not found');
    }

    await this.cacheService.set(cacheKey, company);
    return company;
  }
}
