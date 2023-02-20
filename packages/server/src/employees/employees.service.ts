import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, Employee } from '@prisma/client';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async createEmployee(
    newEmployee: Prisma.EmployeeCreateInput,
  ): Promise<Employee> {
    return this.prisma.employee.create({ data: newEmployee });
  }
}
