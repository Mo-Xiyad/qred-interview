import { Invoice } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { IInvoiceRepo } from '../interfaces/repository.interface';
import { CacheService } from './cache.service';

export class InvoiceService {
  private cacheKeyPrefix = 'invoice:';

  constructor(
    private repo: IInvoiceRepo<Invoice>,
    private cacheService: CacheService
  ) {}

  async getInvoices() {
    const cacheKey = `${this.cacheKeyPrefix}list`;
    const cached = await this.cacheService.get<Invoice[]>(cacheKey);

    if (cached) return cached;

    const invoices = await this.repo.findAll();
    await this.cacheService.set(cacheKey, invoices);
    return invoices;
  }

  async getInvoiceById(id: number) {
    const cacheKey = `${this.cacheKeyPrefix}${id}`;
    const cached = await this.cacheService.get<Invoice>(cacheKey);

    if (cached) return cached;

    const invoice = await this.repo.findById(id);
    if (!invoice) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Invoice not found'
      });
    }

    await this.cacheService.set(cacheKey, invoice);
    return invoice;
  }

  async getInvoicesByCompany(companyId: number) {
    const cacheKey = `${this.cacheKeyPrefix}company:${companyId}`;
    const cached = await this.cacheService.get<Invoice[]>(cacheKey);

    if (cached) return cached;

    const invoices = await this.repo.findByCompany(companyId);
    await this.cacheService.set(cacheKey, invoices);
    return invoices;
  }

  async getDueInvoices(companyId: number) {
    const cacheKey = `${this.cacheKeyPrefix}due:${companyId}`;
    const cached = await this.cacheService.get<Invoice[]>(cacheKey);

    if (cached) return cached;

    const invoices = await this.repo.findByCompany(companyId);

    if (invoices.length === 0) {
      return [];
    }
    const dueInvoices = invoices.filter(
      (invoice) => invoice.dueDate && invoice.dueDate < new Date()
    );
    await this.cacheService.set(cacheKey, dueInvoices);
    return dueInvoices;
  }
}
