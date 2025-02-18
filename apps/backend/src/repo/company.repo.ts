import { Company, PrismaClient } from '@prisma/client';
import { ICompanyRepo } from '../interfaces/repository.interface';

export class CompanyRepo implements ICompanyRepo<Company> {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Company[]> {
    return this.prisma.company.findMany({
      orderBy: { name: 'asc' }
    });
  }

  async findById(id: number): Promise<Company | null> {
    return this.prisma.company.findUnique({
      where: { id }
    });
  }
}
