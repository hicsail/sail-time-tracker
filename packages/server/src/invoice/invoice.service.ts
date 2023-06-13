import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Invoice, Project } from '@prisma/client';
import { InvoiceCreateInput } from './dto/invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}
  async getAllInvoices(): Promise<(Invoice & { project: Project })[]> {
    return this.prisma.invoice.findMany({
      include: {
        project: true
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
}
