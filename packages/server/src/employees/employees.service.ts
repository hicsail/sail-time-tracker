import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, Employee } from '@prisma/client';
import { EmployeeDeleteReturnModel } from './model/employee.model';
import { ProjectModel } from '../project/model/project.model';
import { endOfWeek, previousDay } from 'date-fns';
import { RecordModelWithProject, RecordWithFavoriteProjectModel } from '../record/model/record.model';

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
   * @param startDate
   * @param endDate
   */
  async getRecords(employeeId: string, startDate: Date, endDate: Date): Promise<RecordModelWithProject[]> {
    const records = await this.prisma.record.findMany({
      where: {
        employeeId: employeeId,
        date: {
          lte: endDate,
          gte: startDate
        }
      },
      include: {
        project: true
      }
    });

    return records.map((record) => {
      return {
        startDate: record.date,
        endDate: endOfWeek(record.date, { weekStartsOn: 0 }),
        hours: record.hours,
        project: record.project
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
    // get current week records
    const records = await this.prisma.record.findMany({
      where: {
        employeeId: employeeId,
        date: date
      },
      include: {
        project: true
      }
    });

    // get previous week records
    const previousWeekRecords = await this.prisma.record.findMany({
      where: {
        employeeId: employeeId,
        date: previousDay(date, 1)
      }
    });

    // get favorite project by employee id
    const favoriteProjects = await this.getFavoriteProjects(employeeId);
    const isRecordMap = new Set();
    const isFavoriteMap = new Set();
    const previousWeekMap = new Map();
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

    // create previous week map to store previous week project hours
    // (key: projectId, value: hours)
    previousWeekRecords.forEach((record) => {
      previousWeekMap.set(record.projectId, record.hours);
    });

    // check project in combined list is favorite or not
    combined.forEach((project) => {
      // add field isFavorite
      project.isFavorite = isFavoriteMap.has(project.id);

      // add field previousWeek
      project.previousWeek = previousWeekMap.has(project.id) ? previousWeekMap.get(project.id) : 0;
    });

    // find indirect and absence project
    const indirectRecord = combined.find((project) => project.name === 'Indirect');
    const absenceRecord = combined.find((project) => project.name === 'Absence');

    // remove indirect and absence from combined array
    // and add them at the front of the combined array
    combined.splice(combined.indexOf(indirectRecord), 1);
    combined.splice(combined.indexOf(absenceRecord), 1);
    combined.splice(0, 0, indirectRecord);
    combined.splice(1, 0, absenceRecord);

    return combined;
  }
}
