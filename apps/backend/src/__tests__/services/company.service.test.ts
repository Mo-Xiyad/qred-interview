import { CompanyRepo } from '../../repo/company.repo';
import { CompanyService } from '../../services/company.service';
import { createMockContext, mockCompany } from '../helpers/mocks';

describe('CompanyService', () => {
  const mockContext = createMockContext();
  let companyRepo: CompanyRepo;
  let companyService: CompanyService;

  beforeEach(() => {
    companyRepo = new CompanyRepo(mockContext.prisma);
    companyService = new CompanyService(companyRepo, mockContext.cache);
  });

  describe('getCompanies', () => {
    it('should return cached companies if(true)', async () => {
      const cachedCompanies = [mockCompany];
      mockContext.cache.get.mockResolvedValueOnce(cachedCompanies);

      const result = await companyService.getCompanies();

      expect(result).toEqual(cachedCompanies);
      expect(mockContext.cache.get).toHaveBeenCalledWith('company:list');
      expect(mockContext.prisma.company.findMany).not.toHaveBeenCalled();
    });

    it('should fetch and cache companies !== cached', async () => {
      const companies = [mockCompany];
      mockContext.cache.get.mockResolvedValueOnce(null);
      mockContext.prisma.company.findMany.mockResolvedValueOnce(companies);

      const result = await companyService.getCompanies();

      expect(result).toEqual(companies);
      expect(mockContext.cache.get).toHaveBeenCalledWith('company:list');
      expect(mockContext.prisma.company.findMany).toHaveBeenCalled();
      expect(mockContext.cache.set).toHaveBeenCalledWith(
        'company:list',
        companies
      );
    });
  });

  describe('getCompanyById', () => {
    it('return cached company if available', async () => {
      mockContext.cache.get.mockResolvedValueOnce(mockCompany);

      const result = await companyService.getCompanyById(mockCompany.id);

      expect(result).toEqual(mockCompany);
      expect(mockContext.cache.get).toHaveBeenCalledWith(
        `company:${mockCompany.id}`
      );
      expect(mockContext.prisma.company.findUnique).not.toHaveBeenCalled();
    });

    it('should throw error', async () => {
      mockContext.cache.get.mockResolvedValueOnce(null);
      mockContext.prisma.company.findUnique.mockResolvedValueOnce(null);

      await expect(companyService.getCompanyById(2)).rejects.toThrow(
        'Company not found'
      );
    });
  });
});
