import { Injectable } from '@nestjs/common';
import { Project, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { ProjectUpdateInput } from './dto/project.dto';

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
}
