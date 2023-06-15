import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProjectService } from './project.service';
import { ProjectDeleteReturnModel, ProjectModel, ProjectWithRecord } from './model/project.model';
import { ProjectCreateInput, ProjectUpdateInput } from './dto/project.dto';

@Resolver(() => ProjectModel)
export class ProjectResolver {
  constructor(private projectService: ProjectService) {}

  @Query(() => [ProjectModel])
  async projects(): Promise<ProjectModel[]> {
    return this.projectService.getAllProjects();
  }

  @Query(() => ProjectModel)
  async project(@Args('id') id: string): Promise<ProjectModel> {
    return this.projectService.getProjectById(id);
  }

  @Query(() => [ProjectWithRecord])
  async getProjectsWithRecord(@Args('startDate') startDate: Date, @Args('endDate') endDate: Date): Promise<ProjectWithRecord[]> {
    return this.projectService.getProjectsWithRecord(startDate, endDate);
  }

  @Mutation(() => ProjectModel)
  async addProject(@Args('project') project: ProjectCreateInput): Promise<ProjectModel> {
    return this.projectService.addProject(project);
  }

  @Mutation(() => ProjectModel)
  async updateProject(@Args('updateProject') updateProject: ProjectUpdateInput): Promise<ProjectModel> {
    return this.projectService.updateProject(updateProject);
  }

  @Mutation(() => ProjectDeleteReturnModel)
  async deleteProjects(@Args({ name: 'ids', type: () => [String] }) ids: String[]): Promise<ProjectDeleteReturnModel> {
    return this.projectService.deleteProjects(ids);
  }
}
