import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Record } from '@prisma/client';
import { RecordCreateInput } from './dto/record.dto';
import { BatchPayload } from '../favorite-project/model/favorite-project.model';
import { RecordModel } from './model/record.model';

@Injectable()
export class RecordService {
  constructor(private prisma: PrismaService) {}

  /**
   * add one or more records
   * @param record: {employeeId:string, projectId:string, hours: number, date: Date}
   * @returns {count: number}
   */
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

  /**
   * Delete one or more records that have zero hours
   *
   * @param employeeId: string
   * @param projectIds: string[]
   * @param startDate: Date
   * @param endDate: Date
   * @returns {count: number}
   *
   */
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

  async getRecordsByDateRange(startDate: Date, endDate: Date): Promise<RecordModel[]> {
    return this.prisma.record.findMany({
      where: {
        date: {
          lte: endDate,
          gte: startDate
        }
      },
      include: {
        employee: true,
        project: true
      }
    });
  }
}
