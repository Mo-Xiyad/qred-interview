import { z } from 'zod';
import { CardService } from '../services/card.service';
import { publicProcedure, router } from '../utils/trpc';

export const cardRouter = (cardService: CardService) =>
  router({
    getCardsById: publicProcedure
      .input(z.object({ companyId: z.number(), userId: z.number() }))
      .query(async ({ input }) => {
        return cardService.getCardsById(input.companyId, input.userId);
      }),
    getCardSpendingDetails: publicProcedure
      .input(z.object({ cardId: z.number() }))
      .query(async ({ input }) => {
        return cardService.getCardSpendingDetails(input.cardId);
      }),
    getCardTransactions: publicProcedure
      .input(
        z.object({
          cardId: z.number()
        })
      )
      .query(async ({ input }) => {
        return cardService.getCardTransactions(input.cardId);
      })
  });
