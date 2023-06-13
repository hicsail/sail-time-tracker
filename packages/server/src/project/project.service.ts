import { Injectable } from '@nestjs/common';
import { Project, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { ProjectUpdateInput } from './dto/project.dto';
import { ProjectDeleteReturnModel, ProjectWithRecord } from './model/project.model';
import { getTotalIndirectHours, getTotalWorkHours } from '../utils/helperFun';
import { formatHours, formatPercentage } from '../utils/helperFun';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all projects
   */

  async getAllProjects(): Promise<Project[]> {
    return this.prisma.project.findMany();
  }

  /**
   * Get a project by ID
   *
   * @return a matched project
   */
  async getProjectById(id: string): Promise<Project> {
    return this.prisma.project.findUnique({
      where: {
        id: id
      }
    });
  }

  /**
   * Add new project.
   *
   * @returns new project that has been created
   * @param newProject
   */

  async addProject(newProject: Prisma.ProjectCreateInput): Promise<Project> {
    return this.prisma.project.create({ data: newProject });
  }

  /**
   * Update exists project
   *
   * @return project that has been updated
   * @param updateProject
   */
  async updateProject(updateProject: ProjectUpdateInput): Promise<Project> {
    return this.prisma.project.update({
      where: {
        id: updateProject.id as string
      },
      data: updateProject
    });
  }

  /**
   * Delete one or more projects
   *
   * @return total number of deleted project
   * @param ids represents array of ids
   */
  async deleteProjects(ids: String[]): Promise<ProjectDeleteReturnModel> {
    return this.prisma.project.deleteMany({
      where: {
        id: {
          in: ids as string[]
        }
      }
    });
  }

  /**
   * Get projects with records
   *
   * @return a list of projects with records
   * @param startDate
   * @param endDate
   */

  async getProjectsWithRecord(startDate: Date, endDate: Date): Promise<ProjectWithRecord[]> {
    const projects = await this.prisma.project.findMany({
      include: {
        records: {
          where: {
            date: {
              lte: endDate,
              gte: startDate
            }
          },
          include: {
            employee: true
          }
        }
      }
    });

    const indirectHours = getTotalIndirectHours(projects);
    const totalWorkHours = getTotalWorkHours(projects);

    // hide project that not contains any record, is not Indirect, Absence and the status is Active
    return projects
      .filter((project) => project.records.length > 0 && project.name !== 'Indirect' && project.name !== 'Absence' && project.status !== 'Inactive')
      .map((project) => {
        const workHours = project.records.reduce((sum, currentValue) => sum + currentValue.hours, 0);
        const indirectHour = (workHours / totalWorkHours) * indirectHours;

        let employeeHoursMap = new Map();
        let uniqueEmployeeList: any[] = [];

        // calculate total work hours per employee per project
        project.records.map((record) => {
          const employeeId = record.employee.id;
          const hours = record.hours;

          if (!employeeHoursMap.has(employeeId)) {
            employeeHoursMap.set(employeeId, hours);
            uniqueEmployeeList.push(record);
          } else {
            const currentHours = employeeHoursMap.get(employeeId);
            employeeHoursMap.set(employeeId, currentHours + hours);
          }
        });

        const inner = uniqueEmployeeList.map((record) => {
          const { id, name } = record.employee;
          return {
            employeeId: id,
            employeeName: name,
            employeeWorkHours: formatHours(employeeHoursMap.get(id)),
            employeeIndirectHours: formatHours((employeeHoursMap.get(id) / workHours) * indirectHour),
            employeePercentage: formatPercentage(employeeHoursMap.get(id) / workHours)
          };
        });

        return {
          id: project.id,
          name: project.name,
          isBillable: project.isBillable,
          workHours: formatHours(workHours),
          indirectHours: formatHours(indirectHour),
          percentage: formatPercentage(workHours / totalWorkHours),
          billableHours: formatHours(workHours + indirectHour),
          inner: inner
        };
      });
  }
}
