import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { AddBudgetAdjustmentInput } from './dto/budget.dto';
import { BudgetAdjustmentModel, BurndownData, DailySpendRecord, InvoiceRecord } from './model/budget.model';

@Injectable()
export class BudgetService {
  constructor(private prisma: PrismaService) {}

  async getProjectAdjustments(projectId: string): Promise<BudgetAdjustmentModel[]> {
    return this.prisma.budgetAdjustment.findMany({
      where: { projectId },
      orderBy: { date: 'desc' }
    });
  }

  async getBurndownData(projectId: string, startDate: Date, endDate: Date): Promise<BurndownData> {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });

    const adjustments = await this.prisma.budgetAdjustment.findMany({
      where: { projectId },
      orderBy: { date: 'asc' }
    });

    const records = await this.prisma.record.groupBy({
      by: ['date'],
      where: { projectId, date: { lte: endDate } },
      _sum: { hours: true }
    });

    const dailyRecords: DailySpendRecord[] = records
      .map((r) => ({
        date: r.date,
        hours: r._sum.hours || 0,
        cost: (r._sum.hours || 0) * project.rate
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    const invoiceRows = await this.prisma.invoice.findMany({
      where: { projectId, endDate: { lte: endDate } },
      orderBy: { startDate: 'asc' }
    });

    const invoices: InvoiceRecord[] = invoiceRows.map((inv) => ({
      invoiceId: inv.invoiceId,
      startDate: inv.startDate,
      endDate: inv.endDate,
      amount: inv.amount
    }));

    return {
      projectId,
      projectName: project.name,
      projectRate: project.rate,
      adjustments,
      dailyRecords,
      invoices
    };
  }

  async addBudgetAdjustment(input: AddBudgetAdjustmentInput): Promise<BudgetAdjustmentModel> {
    return this.prisma.budgetAdjustment.create({ data: input });
  }

  async deleteBudgetAdjustment(id: string): Promise<BudgetAdjustmentModel> {
    return this.prisma.budgetAdjustment.delete({ where: { id } });
  }

}
