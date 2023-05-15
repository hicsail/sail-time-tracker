import { Injectable } from '@nestjs/common';
import { Project, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { ProjectUpdateInput } from './dto/project.dto';
import { ProjectDeleteReturnModel } from './model/project.model';
import { RecordModelWithEmployee } from '../record/model/record.model';
import { endOfWeek } from 'date-fns';

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
   * Get records of the project
   *
   * @return a list of records with employee data
   * @param projectId represents project id
   * @param date
   */
  async getRecords(projectId: string, date: Date): Promise<RecordModelWithEmployee[]> {
    const records = await this.prisma.record.findMany({
      where: {
        projectId: projectId,
        date: date
      },
      include: {
        employee: true
      }
    });

    return records.map((record) => {
      return {
        startDate: record.date,
        endDate: endOfWeek(record.date, { weekStartsOn: 0 }),
        hours: record.hours,
        employee: record.employee
      };
    });
  }
}
