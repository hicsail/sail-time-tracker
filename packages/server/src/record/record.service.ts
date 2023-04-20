import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Record } from '@prisma/client';
import { RecordCreateInput } from './dto/record.dto';

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
}
