import { Injectable } from '@nestjs/common';
import { Project, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { ProjectUpdateInput } from './dto/project.dto';
import { ProjectDeleteReturnModel, ProjectWithContractType } from './model/project.model';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all projects
   */

  async getAllProjects(): Promise<ProjectWithContractType[]> {
    return this.prisma.project.findMany({
      include: {
        contractType: true
      }
    });
  }

  /**
   * Get a project by ID
   *
   * @return a matched project
   */
  async getProjectById(id: string): Promise<ProjectWithContractType> {
    return this.prisma.project.findUnique({
      where: {
        id: id
      },
      include: {
        contractType: true
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
    return this.prisma.project.create({
      data: newProject
    });
  }

  /**
   * Update exists project
   *
   * @return project that has been updated
   * @param updateProject
   */
  async updateProject(updateProject: ProjectUpdateInput): Promise<ProjectWithContractType> {
    return this.prisma.project.update({
      where: {
        id: updateProject.id as string
      },
      include: {
        contractType: true
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
  async deleteProjects(ids: string[]): Promise<ProjectDeleteReturnModel> {
    return this.prisma.project.deleteMany({
      where: {
        id: {
          in: ids as string[]
        }
      }
    });
  }
}
