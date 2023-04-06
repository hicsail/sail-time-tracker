import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { BatchPayload } from './model/favorite-project.model';
import { FavoriteProjectCreateInput } from './dto/favorite-project.dto';

@Injectable()
export class FavoriteProjectService {
  constructor(private prisma: PrismaService) {}

  async addFavoriteProject(favoriteProject: FavoriteProjectCreateInput[]): Promise<BatchPayload> {
    return this.prisma.favoriteProject.createMany({
      data: favoriteProject
    });
  }
}
