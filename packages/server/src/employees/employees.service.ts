import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, Employee } from '@prisma/client';
import { EmployeeDeleteReturnModel } from './model/employee.model';
import { ProjectModel } from '../project/model/project.model';
import { endOfWeek } from 'date-fns';
import { RecordModel, RecordWithFavoriteProjectModel } from '../record/model/record.model';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all employees
   *
   * @return a list of employee
   */
  async getAllEmployees(): Promise<Employee[]> {
    return this.prisma.employee.findMany();
  }

  /**
   * Get an employee by ID
   *
   * @return a matched employee
   */
  async getEmployeeById(id: string): Promise<Employee> {
    return this.prisma.employee.findUnique({
      where: {
        id: id
      }
    });
  }

  /**
   * Add new Employee
   *
   * @param newEmployee new employee information details
   * @returns new employee that has been created
   */

  async addEmployee(newEmployee: Prisma.EmployeeCreateInput): Promise<Employee> {
    return this.prisma.employee.create({ data: newEmployee });
  }

  /**
   * Update exists employee
   *
   * @return The updated employee
   * @param updateEmployee new updated employee data
   */

  async updateEmployee(updateEmployee: Prisma.EmployeeUpdateInput): Promise<Employee> {
    return this.prisma.employee.update({
      where: {
        id: updateEmployee.id as string
      },
      data: updateEmployee
    });
  }

  /**
   * Delete one or more projects
   *
   * @return total number of deleted project
   * @param ids represents array of ids
   */

  async deleteEmployees(ids: String[]): Promise<EmployeeDeleteReturnModel> {
    return this.prisma.employee.deleteMany({
      where: {
        id: {
          in: ids as string[]
        }
      }
    });
  }

  /**
   * Get favorite projects of an employee
   *
   * @return a list of projects
   * @param employeeId represents employee id
   */
  async getFavoriteProjects(employeeId: string): Promise<ProjectModel[]> {
    return this.prisma.project.findMany({
      where: {
        employees: {
          some: {
            employeeId: employeeId
          }
        }
      }
    });
  }

  /**
   * Get favorite projects of an employee
   *
   * @return a list of projects
   * @param employeeId represents employee id
   * @param date
   */
  async getRecords(employeeId: string, date: Date): Promise<RecordModel[]> {
    const records = await this.prisma.record.findMany({
      where: {
        employeeId: employeeId,
        date: date
      },
      include: {
        project: true
      }
    });

    return records.map((record) => {
      return {
        employeeId: record.employeeId,
        projectId: record.projectId,
        hours: record.hours,
        startDate: record.date,
        endDate: endOfWeek(record.date, { weekStartsOn: 0 })
      };
    });
  }

  /**
   * Get favorite projects With Record
   *
   * @return a combined list of projects
   * @param employeeId represents employee id
   * @param date
   */
  async getRecordsWithFavoriteProject(employeeId: string, date: Date): Promise<RecordWithFavoriteProjectModel[]> {
    const records = await this.prisma.record.findMany({
      where: {
        employeeId: employeeId,
        date: date
      },
      include: {
        project: true
      }
    });

    const favoriteProjects = await this.getFavoriteProjects(employeeId);
    const isRecordMap = new Set();
    const isFavoriteMap = new Set();
    let combined = [];

    // add all project in record to combined list
    records.forEach((record: any) => {
      isRecordMap.add(record.projectId);
      combined.push({ ...record.project, hours: record.hours });
    });

    // add all project in favorite project that is not in record to combined list
    favoriteProjects.forEach((project: any) => {
      if (!isRecordMap.has(project.id)) {
        combined.push({ ...project, hours: 0 });
      }
      isFavoriteMap.add(project.id);
    });

    // check project in combined list is favorite or not
    combined.forEach((project) => (project.isFavorite = isFavoriteMap.has(project.id)));

    return combined;
  }
}
