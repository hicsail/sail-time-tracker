import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Invoice } from '@prisma/client';
import { InvoiceCreateInput, InvoiceItemUpdateInput, InvoiceSearchInput } from './dto/invoice.dto';
import { InvoiceItemModel, InvoiceModelWithProject, InvoiceModelWithProjectAndComments } from './model/invoice.model';
import { EmployeesService } from '../employees/employees.service';
import { NotFoundError } from 'rxjs';

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService, private employeesService: EmployeesService) {}
  async getAllInvoices(): Promise<InvoiceModelWithProject[]> {
    return this.prisma.invoice.findMany({
      include: {
        project: {
          include: {
            contractType: true
          }
        }
      }
    });
  }

  async createOrUpdateInvoice(invoice: InvoiceCreateInput): Promise<Invoice> {
    const { projectId, startDate, endDate, rate, hours, amount } = invoice;
    const projects = await this.employeesService.getProjectWithRecord(startDate, endDate);
    const project = projects.find((e) => e.inner.length > 0 && e.id === projectId);

    // create or update invoice
    const invoiceInfo = await this.prisma.invoice.upsert({
      where: {
        projectId_startDate_endDate: {
          projectId: projectId,
          startDate: startDate,
          endDate: endDate
        }
      },
      create: invoice,
      update: {
        rate: rate,
        hours: hours,
        amount: amount
      }
    });

    // if invoice is created or updated, then create or update invoice items
    if (invoiceInfo) {
      for (const employee of project.inner) {
        const { invoiceId } = invoiceInfo;
        const { employeeId, employeeWorkHours, employeeIndirectHours } = employee;
        const billableHours = employeeWorkHours + employeeIndirectHours;
        const amount = billableHours * rate;

        await this.prisma.invoiceItem.upsert({
          where: {
            invoiceId_employeeId: {
              invoiceId,
              employeeId
            }
          },
          create: {
            invoiceId: invoiceId,
            employeeId: employeeId,
            workHours: employeeWorkHours,
            indirectHours: employeeIndirectHours,
            billableHours,
            rate,
            amount
          },
          update: {
            workHours: employeeWorkHours,
            indirectHours: employeeIndirectHours,
            billableHours,
            rate,
            amount
          }
        });
      }
    }

    return invoiceInfo;
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
        project: {
          include: {
            contractType: true
          }
        },
        comments: {
          orderBy: {
            createDate: 'desc'
          }
        },
        clickUpTask: true,
        items: {
          include: {
            employee: true
          }
        }
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

  async findPreviousInvoice(projectId: string, startDate: Date): Promise<InvoiceModelWithProjectAndComments | null> {
    return this.prisma.invoice.findFirst({
      where: {
        projectId,
        endDate: {
          lt: startDate
        }
      },
      orderBy: {
        endDate: 'desc'
      }
    });
  }

  async findNextInvoice(projectId: string, endDate: Date): Promise<InvoiceModelWithProjectAndComments | null> {
    return this.prisma.invoice.findFirst({
      where: {
        projectId,
        startDate: {
          gt: endDate
        }
      },
      orderBy: {
        startDate: 'asc'
      }
    });
  }

  async updateInvoiceItem(updatedInvoiceItem: InvoiceItemUpdateInput): Promise<InvoiceItemModel> {
    const { invoiceId, employeeId, workHours, indirectHours } = updatedInvoiceItem;

    // FIND INVOICE ITEM
    const invoiceItem = await this.prisma.invoiceItem.findUnique({
      where: {
        invoiceId_employeeId: {
          invoiceId,
          employeeId
        }
      }
    });

    if (!invoiceItem) {
      throw new NotFoundError('invoice item not found');
    }

    const billableHours = workHours >= 0 ? workHours + invoiceItem.indirectHours : invoiceItem.workHours + indirectHours;
    const amount = billableHours * invoiceItem.rate;

    // UPDATE INVOICE ITEM
    const updatedInvoiceItemData = await this.prisma.invoiceItem.update({
      where: {
        invoiceId_employeeId: {
          invoiceId,
          employeeId
        }
      },
      data: {
        workHours,
        indirectHours,
        billableHours,
        amount
      },
      include: {
        employee: true
      }
    });

    // AGGREGATE INVOICE ITEMS, SUM AMOUNT AND HOURS
    const invoiceItemAggregation = await this.prisma.invoiceItem.aggregate({
      where: {
        invoiceId: invoiceId
      },
      _sum: {
        amount: true,
        billableHours: true
      }
    });

    // UPDATE INVOICE AMOUNT AND HOURS
    await this.prisma.invoice.update({
      where: {
        invoiceId: invoiceId
      },
      data: {
        amount: invoiceItemAggregation._sum.amount,
        hours: invoiceItemAggregation._sum.billableHours
      }
    });

    return updatedInvoiceItemData;
  }
}
