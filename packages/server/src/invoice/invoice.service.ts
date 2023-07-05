import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Invoice } from '@prisma/client';
import { InvoiceCreateInput, InvoiceSearchInput } from './dto/invoice.dto';
import { InvoiceModelWithProject, InvoiceModelWithProjectAndComments } from './model/invoice.model';

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}
  async getAllInvoices(): Promise<InvoiceModelWithProject[]> {
    return this.prisma.invoice.findMany({
      include: {
        project: true,
        comments: true
      }
    });
  }

  async createOrUpdateInvoice(invoice: InvoiceCreateInput): Promise<Invoice> {
    return this.prisma.invoice.upsert({
      where: {
        projectId_startDate_endDate: {
          projectId: invoice.projectId,
          startDate: invoice.startDate,
          endDate: invoice.endDate
        }
      },
      create: invoice,
      update: {
        rate: invoice.rate,
        hours: invoice.hours,
        amount: invoice.amount
      }
    });
  }

  async searchInvoice(projectId_startDate_endDate: InvoiceSearchInput): Promise<InvoiceModelWithProjectAndComments> {
    const { projectId, startDate, endDate } = projectId_startDate_endDate;
    return this.prisma.invoice.findUnique({
      where: {
        projectId_startDate_endDate: {
          projectId,
          startDate,
          endDate
        }
      },
      include: {
        project: true,
        comments: true
      }
    });
  }

  async searchInvoicesByDateRange(startDate: Date, endDate: Date): Promise<Invoice[]> {
    return this.prisma.invoice.findMany({
      where: {
        startDate,
        endDate
      }
    });
  }

  async deleteInvoice(projectId_startDate_endDate: InvoiceSearchInput): Promise<Invoice> {
    const { projectId, startDate, endDate } = projectId_startDate_endDate;
    return this.prisma.invoice.delete({
      where: {
        projectId_startDate_endDate: {
          projectId,
          startDate,
          endDate
        }
      }
    });
  }
}
