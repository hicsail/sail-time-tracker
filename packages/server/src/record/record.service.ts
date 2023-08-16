import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Record } from '@prisma/client';
import { RecordCreateInput } from './dto/record.dto';
import { BatchPayload } from '../favorite-project/model/favorite-project.model';

@Injectable()
export class RecordService {
  constructor(private prisma: PrismaService) {}

  async insertOrUpdateRecord(record: RecordCreateInput): Promise<Record> {
    return this.prisma.record.upsert({
      where: {
        date_employeeId_projectId: {
          employeeId: record.employeeId,
          projectId: record.projectId,
          date: record.date
        }
      },
      update: {
        employeeId: record.employeeId,
        projectId: record.projectId,
        hours: record.hours,
        date: record.date
      },
      create: {
        employeeId: record.employeeId,
        projectId: record.projectId,
        hours: record.hours,
        date: record.date
      }
    });
  }

  async deleteZeroHoursRecord(employeeId: string, projectIds: string[], startDate: Date, endDate: Date): Promise<BatchPayload> {
    return this.prisma.record.deleteMany({
      where: {
        employeeId: employeeId,
        projectId: {
          in: projectIds
        },
        date: {
          lte: endDate,
          gte: startDate
        },
        hours: {
          equals: 0
        }
      }
    });
  }
}
