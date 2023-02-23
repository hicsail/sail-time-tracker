import { Injectable } from '@nestjs/common';
import { Project, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

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
   * Add new project.
   *
   * @param new Project information details
   * @returns new project that has been created
   */

  async addProject(newProject: Prisma.ProjectCreateInput): Promise<Project> {
    return this.prisma.project.create({ data: newProject });
  }
}
