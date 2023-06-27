import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Employee } from '@prisma/client';
import { EmployeeDeleteReturnModel, EmployeeWithRecord, ProjectWithEmployeeRecords, ProjectWithEmployeeRecordsInner } from './model/employee.model';
import { ProjectModel } from '../project/model/project.model';
import { GroupedRecordWithFavoriteProjectModel } from '../record/model/record.model';
import { convertToUTCDate, formatDateToDashFormat, formatHours, formatPercentage } from '../utils/helperFun';
import { EmployeeCreateInput, EmployeeUpdateInput } from './dto/employee.dto';

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

  async addEmployee(newEmployee: EmployeeCreateInput): Promise<Employee> {
    return this.prisma.employee.create({ data: newEmployee });
  }

  /**
   * Update exists employee
   *
   * @return The updated employee
   * @param updateEmployee new updated employee data
   */

  async updateEmployee(updateEmployee: EmployeeUpdateInput): Promise<Employee> {
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

  async deleteEmployees(ids: string[]): Promise<EmployeeDeleteReturnModel> {
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

        const totalIndirectHours = employee.records.filter((record) => record.project.name === 'Indirect').reduce((sum, currentValue) => sum + currentValue.hours, 0);
        const projectHoursMap = new Map();
        const uniqueProjectList: any[] = [];

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
            rate: record.project.rate,
            status: record.project.status,
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

  async getProjectWithRecord(startDate: Date, endDate: Date): Promise<ProjectWithEmployeeRecords[]> {
    const projectWithEmployeeRecordData = await this.getEmployeesWithRecord(startDate, endDate);
    const projects = await this.prisma.project.findMany();
    const transformedDate = this.transformData(projectWithEmployeeRecordData);

    let totalProjectWorkHours = 0;

    // calculate percentage of effort for each employee for each project
    transformedDate.forEach((project) => {
      totalProjectWorkHours += project.workHours;
      project.inner.forEach((innerData) => {
        innerData.employeePercentage = formatPercentage(innerData.employeeWorkHours / project.workHours);
      });
    });

    // calculate the percentage effort for each project
    transformedDate.forEach((project) => {
      project.percentage = formatPercentage(project.workHours / totalProjectWorkHours);
    });

    const uniqueProjectMap = new Map();

    transformedDate.forEach((project) => {
      if (!uniqueProjectMap.has(project.id)) {
        uniqueProjectMap.set(project.id, true);
      }
    });

    projects.map((project) => {
      if (!uniqueProjectMap.has(project.id)) {
        const { id, name, isBillable, rate, status } = project;
        const newProjectRecord: ProjectWithEmployeeRecords = {
          id,
          name,
          isBillable,
          status,
          rate,
          workHours: 0,
          indirectHours: 0,
          billableHours: 0,
          percentage: '0.0',
          inner: []
        };
        transformedDate.push(newProjectRecord);
      }
    });

    return transformedDate;
  }

  transformData(inputData: EmployeeWithRecord[]): ProjectWithEmployeeRecords[] {
    const transformedData: ProjectWithEmployeeRecords[] = [];

    // Iterate through each employee record
    for (const employeeRecord of inputData) {
      const { id, name, inner } = employeeRecord;

      // Iterate through each inner project record
      for (const innerRecord of inner) {
        const { projectId, projectName, status, rate, isBillable, projectWorkHours, projectIndirectHours, projectPercentage } = innerRecord;

        // Check if the project already exists in the transformed data
        let projectRecord = transformedData.find((record) => record.id === projectId);

        if (!projectRecord) {
          // Create a new project record if it doesn't exist
          projectRecord = {
            id: projectId,
            name: projectName,
            isBillable: isBillable,
            rate: rate,
            status: status,
            workHours: 0,
            indirectHours: 0,
            billableHours: 0,
            percentage: projectPercentage,
            inner: []
          };
          transformedData.push(projectRecord);
        }

        // Update the project-level totals
        projectRecord.workHours += projectWorkHours;
        projectRecord.indirectHours += projectIndirectHours;
        projectRecord.billableHours += projectWorkHours + projectIndirectHours;

        // Add the employee record to the project's inner array
        const employeeRecord: ProjectWithEmployeeRecordsInner = {
          employeeId: id,
          employeeName: name,
          employeeWorkHours: projectWorkHours,
          employeeIndirectHours: projectIndirectHours,
          employeePercentage: projectPercentage
        };
        projectRecord.inner.push(employeeRecord);
      }
    }

    return transformedData;
  }

  /**
   * Get favorite projects With Record grouped by projectId
   *
   * @return a list of projects With Record grouped by projectId
   * @param employeeId represents employee id
   * @param startDate
   * @param endDate
   */
  async getRecordsWithFavoriteProject(employeeId: string, startDate: Date, endDate: Date): Promise<GroupedRecordWithFavoriteProjectModel[]> {
    // get current week records and all favorite projects
    const [records, favoriteProjects] = await Promise.all([
      this.prisma.record.findMany({
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
      }),
      this.getFavoriteProjects(employeeId)
    ]);

    const isRecordMap = new Set();
    const isFavoriteMap = new Set();
    const combined = [];

    // add all project in record to combined list
    records.forEach((record: any) => {
      isRecordMap.add(record.projectId);
      combined.push({ date: record.date, projectId: record.projectId, hours: record.hours, projectName: record.project.name, description: record.project.description });
    });

    // add all project in favorite project that is not in record to combined list
    favoriteProjects.forEach((project: any) => {
      if (!isRecordMap.has(project.id)) {
        combined.push({ date: null, projectId: project.id, hours: 0, projectName: project.name, description: project.description });
      }
      isFavoriteMap.add(project.id);
    });

    // check project in combined list is favorite or not
    combined.forEach((project) => {
      project.isFavorite = isFavoriteMap.has(project.id);
    });

    // group combined list by project id
    const groupedData = combined.reduce((acc, projectRecord) => {
      const { projectId, projectName, isFavorite, description, date, hours } = projectRecord;
      const existingGroup = acc.find((group) => group.projectId === projectId);
      const formatDate = date ? formatDateToDashFormat(convertToUTCDate(date)) : null;

      if (!existingGroup) {
        acc.push({ projectId, projectName, isFavorite, description, records: [{ date: formatDate, hours: hours }] });
      } else {
        existingGroup.records.push({ date: formatDate, hours: hours });
      }
      return acc;
    }, []);

    // find indirect and absence project from groupedData
    const indirectRecord = groupedData.find((data) => data.projectName === 'Indirect');
    const absenceRecord = groupedData.find((data) => data.projectName === 'Absence');

    // remove indirect and absence from groupedData
    // and add them at the front of the groupedData
    if (indirectRecord) {
      groupedData.splice(groupedData.indexOf(indirectRecord), 1);
      groupedData.splice(0, 0, indirectRecord);
    }

    if (absenceRecord) {
      groupedData.splice(groupedData.indexOf(absenceRecord), 1);
      groupedData.splice(1, 0, absenceRecord);
    }

    return groupedData;
  }
}
