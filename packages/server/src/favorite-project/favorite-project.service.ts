import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { BatchPayload } from './model/favorite-project.model';
import { FavoriteProjectCreateInput } from './dto/favorite-project.dto';

@Injectable()
export class FavoriteProjectService {
  constructor(private prisma: PrismaService) {}

  /**
   * add one or more favorite projects
   *
   * @param favoriteProject an array of favorite project
   * @returns {count: number}
   */
  async addFavoriteProject(favoriteProject: FavoriteProjectCreateInput[]): Promise<BatchPayload> {
    return this.prisma.favoriteProject.createMany({
      data: favoriteProject
    });
  }

  /**
   * Delete one or more favorite projects
   *
   * @return total number of deleted favorite projects
   * @param employeeId represents employee id
   * @param projectIds represents array of project id
   */

  async deleteFavoriteProjects(employeeId: string, projectIds: string[]): Promise<BatchPayload> {
    return this.prisma.favoriteProject.deleteMany({
      where: {
        employeeId: employeeId,
        projectId: {
          in: projectIds
        }
      }
    });
  }
}
