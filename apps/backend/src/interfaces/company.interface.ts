import { Company, Prisma } from '@prisma/client';
export interface ICompany extends Company {}

export interface ICreateCompany extends Prisma.CompanyCreateInput {}

export interface IUpdateCompany extends Prisma.CompanyUpdateInput {}
