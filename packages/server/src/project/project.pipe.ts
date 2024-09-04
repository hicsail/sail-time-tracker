import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { ProjectWithContractType } from './model/project.model';
import { ProjectService } from './project.service';

@Injectable()
export class ProjectPipe implements PipeTransform<string, Promise<ProjectWithContractType>> {
  constructor(private readonly projectService: ProjectService) {}

  async transform(value: string): Promise<ProjectWithContractType> {
    const project = await this.projectService.getProjectById(value);
    if (!project) {
      throw new NotFoundException(`Project with id ${value} not found`);
    }

    return project;
  }
}
