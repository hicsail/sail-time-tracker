import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { BillableHours } from '@prisma/client';
import { BillableHoursCreateInput, BillableHoursSearchInput } from './dto/billable.dto';

@Injectable()
export class BillableHoursService {
  constructor(private prisma: PrismaService) {}

  async createOrUpdateBillableHours(input: BillableHoursCreateInput): Promise<BillableHours> {
    const { precalculatedHours, billableHours } = input;
    const existingRecord = await this.existingRecord(input);

    return this.prisma.$transaction(async (prisma) => {
      if (existingRecord) {
        // Update the existing record
        return prisma.billableHours.update({
          where: { id: existingRecord.id },
          data: {
            precalculatedHours: precalculatedHours,
            billableHours: billableHours
          }
        });
      } else {
        // Create a new record
        return prisma.billableHours.create({
          data: input
        });
      }
    });
  }

  async existingRecord(input: BillableHoursCreateInput): Promise<BillableHours> {
    const { projectId, startDate, endDate, employeeId } = input;
    return this.prisma.billableHours.findFirst({
      where: {
        projectId: projectId,
        startDate: startDate,
        endDate: endDate,
        employeeId: employeeId
      }
    });
  }

  async searchBillableHours(input: BillableHoursSearchInput): Promise<BillableHours[]> {
    const { startDate, endDate } = input;
    return this.prisma.billableHours.findMany({
      where: {
        startDate: {
          gte: startDate
        },
        endDate: {
          lte: endDate
        }
      }
    });
  }
}
