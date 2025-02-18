import { Company, Invoice, PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { CacheService } from '../../services/cache.service';

export type Context = {
  prisma: PrismaClient;
};

export type MockContext = {
  prisma: DeepMockProxy<PrismaClient>;
  cache: DeepMockProxy<CacheService>;
};

export const createMockContext = (): MockContext => {
  return {
    prisma: mockDeep<PrismaClient>(),
    cache: mockDeep<CacheService>()
  };
};

export const mockCompany: Company = {
  id: 1,
  name: 'Test Company',
  userId: 1,
  createdAt: new Date(),
  updatedAt: new Date()
};

export const mockInvoice: Invoice = {
  id: 1,
  amountDue: 1000,
  dueDate: new Date(),
  status: 'PENDING',
  companyId: 1,
  createdAt: new Date(),
  updatedAt: new Date()
};
