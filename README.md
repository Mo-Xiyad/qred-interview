# Qred Backend

A TypeScript-based backend service using tRPC, Prisma, and Express.

## Tech Stack

- **Framework**: Express.js with tRPC
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis
- **Language**: TypeScript
- **Testing**: Jest
- **Development**: tsx

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `mobile`: an expo app that runs the api endpoints from the backend
- `backend`: a simple express server that serves a few api endpoints and uses [tRPC](https://trpc.io) for type-safe communication between the frontend and backend
- `shared`: a shared package that contains types and utilities that are used by both the frontend and backend

## Getting Started

1. **Install dependencies**

```bash
pnpm install
```

2. **Set up environment variables**
   Create a `.env` file in the `apps/backend/src/config` directory and add those environment variables.

3. **build backend**

```bash
pnpm build
```

4. **run generate to generate the prisma client**

```bash
pnpm db:generate
```

5. **Run database migrations**

```bash
pnpm db:migrate
```

6. **Run the backend**

```bash
pnpm dev
```

7. **Run the mobile app**

```bash
cd apps/mobile
pnpm dev
```

## API Routes

### Card Routes

- `card.getCardsById` - Get cards by company and user ID
- `card.getCardSpendingDetails` - Get card spending details
- `card.getCardTransactions` - Get card transactions

### Company Routes

- `company.companyList` - Get all companies
- `company.getCompanyById` - Get company by ID

### Invoice Routes

- `invoice.invoiceList` - Get all invoices
- `invoice.getInvoice` - Get invoice by ID
- `invoice.getDueInvoices` - Get due invoices

## Testing

The project uses Jest for testing. Tests are located in the `src/__tests__` directory.

To run tests:

```bash
pnpm test
```

**make sure that getBaseUrl in apps/mobile/src/utils/api.ts is set to the correct url of the backend server.**
