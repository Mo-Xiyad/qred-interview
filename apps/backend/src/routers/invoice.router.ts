import { z } from 'zod';
import { InvoiceService } from '../services/invoice.service';
import { publicProcedure, router } from '../utils/trpc';

const InvoiceSchema = z.object({
  number: z.string(),
  amount: z.number().positive(),
  dueDate: z.string().transform((str) => new Date(str)),
  status: z.enum(['PAID', 'PENDING', 'OVERDUE']),
  companyId: z.string()
});

export const invoiceRouter = (invoiceService: InvoiceService) =>
  router({
    invoiceList: publicProcedure.query(async () => {
      return invoiceService.getInvoices();
    }),

    getInvoice: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return invoiceService.getInvoiceById(input.id);
      }),
    getDueInvoices: publicProcedure
      .input(z.object({ companyId: z.number() }))
      .query(async ({ input }) => {
        return invoiceService.getDueInvoices(input.companyId);
      })
  });
