import { InvoiceRepo } from '../../repo/invoice.repo';
import { InvoiceService } from '../../services/invoice.service';
import { createMockContext, mockInvoice } from '../helpers/mocks';

describe('InvoiceService', () => {
  const mockContext = createMockContext();
  let invoiceRepo: InvoiceRepo;
  let invoiceService: InvoiceService;

  beforeEach(() => {
    invoiceRepo = new InvoiceRepo(mockContext.prisma);
    invoiceService = new InvoiceService(invoiceRepo, mockContext.cache);
  });

  describe('getInvoicesByCompany', () => {
    const companyId = 1;
    const cacheKey = `invoice:company:${companyId}`;

    it('should return cached invoices if(true)', async () => {
      const cachedInvoices = [mockInvoice];
      mockContext.cache.get.mockResolvedValueOnce(cachedInvoices);

      const result = await invoiceService.getInvoicesByCompany(companyId);

      expect(result).toEqual(cachedInvoices);
      expect(mockContext.cache.get).toHaveBeenCalledWith(cacheKey);
      expect(mockContext.prisma.invoice.findMany).not.toHaveBeenCalled();
    });

    it('should fetch and cache invoices !== cached', async () => {
      const invoices = [mockInvoice];
      mockContext.cache.get.mockResolvedValueOnce(null);
      mockContext.prisma.invoice.findMany.mockResolvedValueOnce(invoices);

      const result = await invoiceService.getInvoicesByCompany(companyId);

      expect(result).toEqual(invoices);
      expect(mockContext.cache.get).toHaveBeenCalledWith(cacheKey);
      expect(mockContext.prisma.invoice.findMany).toHaveBeenCalledWith({
        where: { companyId },
        include: { company: true },
        orderBy: { dueDate: 'desc' }
      });
      expect(mockContext.cache.set).toHaveBeenCalledWith(cacheKey, invoices);
    });

    it('should return empty array', async () => {
      mockContext.cache.get.mockResolvedValueOnce(null);
      mockContext.prisma.invoice.findMany.mockResolvedValueOnce([]);

      const result = await invoiceService.getInvoicesByCompany(companyId);

      expect(result).toEqual([]);
    });
  });
});
