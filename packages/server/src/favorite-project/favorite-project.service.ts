import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class FavoriteProjectService {
  constructor(private prisma: PrismaService) {}

  async addFavoriteProject(newFavoriteProject: Prisma.Enumerable<Prisma.FavoriteProjectCreateManyInput>): Promise<Prisma.BatchPayload> {
    return this.prisma.favoriteProject.createMany({
      data: newFavoriteProject
    });
  }
}
