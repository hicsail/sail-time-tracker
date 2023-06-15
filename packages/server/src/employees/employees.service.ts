import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, Employee } from '@prisma/client';
import { EmployeeDeleteReturnModel, EmployeeWithRecord } from './model/employee.model';
import { ProjectModel } from '../project/model/project.model';
import { previousDay } from 'date-fns';
import { RecordWithFavoriteProjectModel } from '../record/model/record.model';
import { formatHours, formatPercentage } from '../utils/helperFun';

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
   * Get employees with records
   *
   * @return a list of employees with records
   * @param startDate
   * @param endDate
   */

  async getEmployeesWithRecord(startDate: Date, endDate: Date): Promise<EmployeeWithRecord[]> {
    const employees = await this.prisma.employee.findMany({
      include: {
        records: {
          where: {
            date: {
              lte: endDate,
              gte: startDate
            }
          },
          include: {
            project: true
          }
        }
      }
    });

    // hide project that not contains any record, is not Indirect, Absence and the status is Active
    return employees
      .filter((employee) => employee.status !== 'Inactive')
      .map((employee) => {
        const totalWorkHours = employee.records
          .filter((record) => record.project.name !== 'Indirect' && record.project.name !== 'Absence')
          .reduce((sum, currentValue) => sum + currentValue.hours, 0);

        let totalIndirectHours = employee.records.filter((record) => record.project.name === 'Indirect').reduce((sum, currentValue) => sum + currentValue.hours, 0);
        let projectHoursMap = new Map();
        let uniqueProjectList: any[] = [];

        // store unique projects and total hours to uniqueProjectList
        // from startDate to endDate
        employee.records
          .filter((record) => record.project.name !== 'Indirect' && record.project.name !== 'Absence')
          .forEach((record) => {
            if (!projectHoursMap.get(record.project.id)) {
              projectHoursMap.set(record.project.id, record.hours);
              uniqueProjectList.push(record);
            } else {
              projectHoursMap.set(record.project.id, projectHoursMap.get(record.project.id) + record.hours);
            }
          });

        // get inner table data
        const inner = uniqueProjectList.map((record) => {
          const indirectHour = (projectHoursMap.get(record.project.id) / totalWorkHours) * totalIndirectHours;
          return {
            projectId: record.project.id,
            projectName: record.project.name,
            isBillable: record.project.isBillable,
            projectWorkHours: formatHours(projectHoursMap.get(record.project.id)),
            projectIndirectHours: formatHours(indirectHour),
            projectPercentage: formatPercentage(projectHoursMap.get(record.project.id) / totalWorkHours)
          };
        });

        return {
          id: employee.id,
          name: employee.name,
          workHours: formatHours(totalWorkHours),
          indirectHours: formatHours(totalIndirectHours),
          billableHours: formatHours(totalWorkHours + totalIndirectHours),
          inner: inner
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
