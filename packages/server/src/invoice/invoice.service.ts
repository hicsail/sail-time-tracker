import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Invoice, Project } from '@prisma/client';
import {InvoiceCreateInput, InvoiceSearchInput} from './dto/invoice.dto';

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

  async searchInvoice(projectId_startDate_endDate: InvoiceSearchInput): Promise<Invoice & { project: Project }> {
    const {projectId, startDate, endDate} = projectId_startDate_endDate;
    return this.prisma.invoice.findUnique({
      where: {
        projectId_startDate_endDate: {
          projectId: projectId,
          startDate: startDate,
          endDate: endDate
        }
      },
      include: {
        project: true
      }
    })
  }
}
