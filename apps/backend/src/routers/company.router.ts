import { z } from 'zod';
import { CompanyService } from '../services/company.service';
import { publicProcedure, router } from '../utils/trpc';

export const companyRouter = (companyService: CompanyService) =>
  router({
    companyList: publicProcedure.query(async () => {
      return companyService.getCompanies();
    }),

    getCompany: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return companyService.getCompanyById(input.id);
      })
  });
