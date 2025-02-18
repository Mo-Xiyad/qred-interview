import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const transactions = [
    {
      amount: 100,
      description: 'At store A',
      date: new Date('2025-01-01')
    },
    {
      amount: 50,
      description: 'At store B',
      date: new Date('2025-01-02')
    },
    {
      amount: 150,
      description: 'At store C',
      date: new Date('2025-01-03')
    },
    {
      amount: 200,
      description: 'At store D',
      date: new Date('2025-01-04')
    },
    {
      amount: 300,
      description: 'At store E',
      date: new Date('2025-01-05')
    }
  ];

  for (const transaction of transactions) {
    await prisma.transaction.create({
      data: {
        amount: transaction.amount,
        description: transaction.description,
        date: transaction.date,
        cardId: 1
      }
    });
  }

  const invoices = [
    {
      amountDue: 100,
      dueDate: new Date('2025-01-01')
    },
    {
      amountDue: 200,
      dueDate: new Date('2025-01-02')
    },
    {
      amountDue: 300,
      dueDate: new Date('2025-01-03')
    }
  ];

  for (const invoice of invoices) {
    await prisma.invoice.create({
      data: {
        amountDue: invoice.amountDue,
        dueDate: invoice.dueDate,
        companyId: 1
      }
    });
  }

  console.log('Seed data added! 🎊');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
