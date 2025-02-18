import { Invoice, PrismaClient } from '@prisma/client';
import { IInvoiceRepo } from '../interfaces/repository.interface';

export class InvoiceRepo implements IInvoiceRepo<Invoice> {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Invoice[]> {
    return this.prisma.invoice.findMany({
      include: { company: true },
      orderBy: { dueDate: 'desc' }
    });
  }

  async findById(id: number): Promise<Invoice | null> {
    return this.prisma.invoice.findUnique({
      where: { id },
      include: { company: true }
    });
  }

  async findByCompany(companyId: number): Promise<Invoice[]> {
    return this.prisma.invoice.findMany({
      where: { companyId },
      include: { company: true },
      orderBy: { dueDate: 'desc' }
    });
  }
}
