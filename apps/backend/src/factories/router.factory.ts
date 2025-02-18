import { PrismaClient } from '@prisma/client';
import { cardRouter } from '../routers/card.router';
import { companyRouter } from '../routers/company.router';
import { invoiceRouter } from '../routers/invoice.router';
import { router } from '../utils/trpc';
import { CardFactory } from './card.factory';
import { CompanyFactory } from './company.factory';
import { InvoiceFactory } from './invoice.factory';

export class RouterFactory {
  static create(prisma: PrismaClient) {
    const companyService = CompanyFactory.create(prisma);
    const invoiceService = InvoiceFactory.create(prisma);
    const cardService = CardFactory.create(prisma);
    return router({
      company: companyRouter(companyService),
      invoice: invoiceRouter(invoiceService),
      card: cardRouter(cardService)
    });
  }
}
