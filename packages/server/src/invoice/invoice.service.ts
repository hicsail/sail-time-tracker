import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Invoice } from '@prisma/client';
import { InvoiceCreateInput, InvoiceSearchInput } from './dto/invoice.dto';
import { ClickUpStatuses, InvoiceModelWithProject, InvoiceModelWithProjectAndComments, ListCustomField } from './model/invoice.model';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService, private readonly httpService: HttpService, private configService: ConfigService) {}
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
      },
      include: {
        project: true,
        comments: true
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
      },
      include: {
        project: true,
        comments: true
      }
    });
  }

  async getClickUpCustomFields(): Promise<ListCustomField[]> {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.configService.get<string>('CLICKUP_URL')}/${this.configService.get<string>('CLICKUP_LIST_ID')}/field`, {
        headers: {
          Authorization: this.configService.get<string>('CLICKUP_TOKEN')
        }
      })
    );

    return data.fields.filter((field) => field.type !== 'formula' && field.name !== 'Award Amount' && field.name !== 'Responsible Personnel');
  }

  async getClickUpStatuses(): Promise<ClickUpStatuses[]> {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.configService.get<string>('CLICKUP_URL')}/${this.configService.get<string>('CLICKUP_LIST_ID')}`, {
        headers: {
          Authorization: this.configService.get<string>('CLICKUP_TOKEN')
        }
      })
    );

    return data.statuses;
  }
}
