import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, Employee } from '@prisma/client';

@Injectable()
export class EmployeesService {

  constructor(private prisma: PrismaService) {}

  /**
   * Get all employees
   */
  async getAllEmployees(): Promise<Employee[]>{
    return this.prisma.employee.findMany();
  }

  /**
   * Add new Employee
   *
   * @param new employee information details
   * @returns new employee that has been created
   */

  async addEmployee(
      newEmployee: Prisma.EmployeeCreateInput,
  ): Promise<Employee> {
    return this.prisma.employee.create({ data: newEmployee });
  }

}
