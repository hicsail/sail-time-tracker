import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectResolver } from './project.resolver';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [PrismaModule.forRoot()],
  providers: [ProjectService, ProjectResolver],
  exports: [ProjectService]
})
export class ProjectModule {}
