import { Card, PrismaClient, Transaction } from '@prisma/client';
import { ICardRepo } from '../interfaces/repository.interface';

export class CardRepo implements ICardRepo<Card> {
  constructor(private prisma: PrismaClient) {}

  async getCardsById(
    companyId: number,
    userId: number
  ): Promise<Card[] | null> {
    return this.prisma.card.findMany({
      where: { companyId, userId },
      include: {
        company: true,
        transactions: true
      }
    });
  }

  async getCardById(cardId: number): Promise<Card | null> {
    return this.prisma.card.findUnique({
      where: { id: cardId }
    });
  }

  async getCardSpendingDetails(cardId: number): Promise<{
    spendLimit: number;
    remainingSpend: number;
    totalSpent: number;
  } | null> {
    const card = await this.prisma.card.findUnique({
      where: { id: cardId },
      include: {
        transactions: {
          select: {
            amount: true
          }
        }
      }
    });

    if (!card) return null;

    const totalSpent = card.transactions.reduce(
      (sum, tx) => sum + tx.amount,
      0
    );

    return {
      spendLimit: card.spendLimit,
      remainingSpend: card.remainingSpend,
      totalSpent
    };
  }

  async getCardTransactions(
    cardId: number
    // options: {
    //   limit?: number;
    //   offset?: number;
    //   startDate?: Date;
    //   endDate?: Date;
    // } = {}
  ): Promise<{
    transactions: Transaction[];
    total: number;
  }> {
    // const { limit = 10, offset = 0, startDate, endDate } = options;

    const where = {
      cardId
      // ...(startDate && endDate
      //   ? {
      //       date: {
      //         gte: startDate,
      //         lte: endDate
      //       }
      //     }
      //   : {})
    };

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        include: {
          card: {
            include: {
              company: true
            }
          }
        },
        orderBy: {
          date: 'desc'
        }
        // take: limit,
        // skip: offset
      }),
      this.prisma.transaction.count({ where })
    ]);

    return {
      transactions,
      total
    };
  }
}
