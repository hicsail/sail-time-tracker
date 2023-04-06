import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Employee, Record } from '@prisma/client';
import { RecordCreateInput } from './dto/record.dto';

@Injectable()
export class RecordService {
  constructor(private prisma: PrismaService) {}

  async insertOrUpdateRecord(record: RecordCreateInput): Promise<Record> {
    return this.prisma.record.upsert({
      where: {
        date_employeeId_projectId: {
          employeeId: record.employee.id,
          projectId: record.project.id,
          date: record.date
        }
      },
      update: {
        employeeId: record.employee.id,
        projectId: record.project.id,
        hours: record.hours,
        date: record.date
      },
      create: {
        employeeId: record.employee.id,
        projectId: record.project.id,
        hours: record.hours,
        date: record.date
      }
    });
  }

  async getEmployeeRecord(employee: Employee) {
    return this.prisma.employee.findUnique({
      where: {
        id: employee.id
      }
    });
  }
}
