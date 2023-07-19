import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProjectService } from './project.service';
import { ContractTypeModel, ProjectDeleteReturnModel, ProjectModel, ProjectWithContractType } from './model/project.model';
import { ProjectCreateInput, ProjectUpdateInput } from './dto/project.dto';

@Resolver(() => ProjectModel)
export class ProjectResolver {
  constructor(private projectService: ProjectService) {}

  @Query(() => [ProjectWithContractType])
  async projects(): Promise<(ProjectModel & { contractType: ContractTypeModel })[]> {
    return this.projectService.getAllProjects();
  }

  @Query(() => ProjectWithContractType)
  async project(@Args('id') id: string): Promise<ProjectModel & { contractType: ContractTypeModel }> {
    return this.projectService.getProjectById(id);
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
  async deleteProjects(@Args({ name: 'ids', type: () => [String] }) ids: string[]): Promise<ProjectDeleteReturnModel> {
    return this.projectService.deleteProjects(ids);
  }
}
