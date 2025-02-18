import { CardFactory } from '../factories/card.factory';
import { CompanyFactory } from '../factories/company.factory';
import { InvoiceFactory } from '../factories/invoice.factory';
import { prisma } from '../utils/prisma';
import { router } from '../utils/trpc';
import { cardRouter } from './card.router';
import { companyRouter } from './company.router';
import { invoiceRouter } from './invoice.router';

export const appRouter = router({
  company: companyRouter(CompanyFactory.create(prisma)),
  invoice: invoiceRouter(InvoiceFactory.create(prisma)),
  card: cardRouter(CardFactory.create(prisma))
});

export type AppRouter = typeof appRouter;
