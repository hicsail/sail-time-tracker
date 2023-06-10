import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, Invoice } from '@prisma/client';
import { InvoiceCreateInput } from './dto/invoice.dto';
import { InvoiceSummaryModel } from './model/invoice.model';

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}
  async getAllInvoices(): Promise<Invoice[]> {
    return this.prisma.invoice.findMany({
      include: {
        project: true,
        employee: true
      }
    });
  }

  async getInvoiceSummary(): Promise<InvoiceSummaryModel[]> {
    const invoices = await this.prisma.invoice.findMany({
      include: {
        project: true,
        employee: true
      }
    });

    const uniqueEntriesMap = new Map();

    invoices.forEach((invoice) => {
      const { projectId, startDate, endDate, amount, hours } = invoice;
      const { name } = invoice.project;

      const key = `${projectId}/${name}/${startDate}/${endDate}`;

      if (uniqueEntriesMap.has(key)) {
        const entry = uniqueEntriesMap.get(key);
        entry.amount += amount;
        entry.hours += hours;
      } else {
        const entry = {
          projectId: projectId,
          projectName: name,
          startDate: startDate,
          endDate: endDate,
          amount,
          hours
        };
        uniqueEntriesMap.set(key, entry);
      }
    });

    return Array.from(uniqueEntriesMap.values());
  }

  async createOrUpdateManyInvoice(invoices: InvoiceCreateInput[]): Promise<Prisma.BatchPayload> {
    const existsInvoices = [];
    const newInvoices = [];

    // Separate invoices into existing and new ones
    for (const invoice of invoices) {
      const findInvoice = await this.prisma.invoice.findUnique({
        where: {
          employeeId_projectId_startDate_endDate: {
            employeeId: invoice.employeeId,
            projectId: invoice.projectId,
            startDate: invoice.startDate,
            endDate: invoice.endDate
          }
        }
      });

      if (findInvoice) {
        existsInvoices.push(invoice);
      } else {
        newInvoices.push(invoice);
      }
    }

    // Update existing invoices
    if (existsInvoices.length > 0) {
      const updatePromises = existsInvoices.map((invoice) =>
        this.prisma.invoice.updateMany({
          where: {
            employeeId: invoice.employeeId,
            projectId: invoice.projectId,
            startDate: invoice.startDate,
            endDate: invoice.endDate
          },
          data: invoice
        })
      );
      await Promise.all(updatePromises);
    }

    // Create new invoices
    if (newInvoices.length > 0) {
      await this.prisma.invoice.createMany({
        data: newInvoices
      });
    }

    // Return the batch payload
    return { count: invoices.length };
  }
}
