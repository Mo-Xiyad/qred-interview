import { Card, Transaction } from '@prisma/client';

export interface ICompanyRepo<T> {
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T | null>;
}

export interface IInvoiceRepo<T> {
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  findByCompany(companyId: number): Promise<T[]>;
}

export interface ICardRepo<T> {
  getCardsById(companyId: number, userId: number): Promise<Card[] | null>;
  getCardSpendingDetails(cardId: number): Promise<{
    spendLimit: number;
    remainingSpend: number;
    totalSpent: number;
  } | null>;
  getCardTransactions(cardId: number): Promise<{
    transactions: Transaction[];
    total: number;
  }>;
}
