import { Module } from '@nestjs/common';
import { FavoriteProjectService } from './favorite-project.service';
import { FavoriteProjectResolver } from './favorite-project.resolver';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [PrismaModule.forRoot()],
  providers: [FavoriteProjectService, FavoriteProjectResolver]
})
export class FavoriteProjectModule {}
