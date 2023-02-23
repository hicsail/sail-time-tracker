import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import {ProjectService} from "./project.service";
import {ProjectModel} from "./model/project.model";
import {ProjectCreateInput} from "./dto/project.dto";

@Resolver(() => ProjectModel)
export class ProjectResolver {

    constructor( private projectService: ProjectService ) {}

    @Query(() => [ProjectModel])
    async projects(): Promise<ProjectModel[]>{
        return this.projectService.getAllProjects();
    }

    @Mutation(() => ProjectModel)
    async addProject(@Args('project') project: ProjectCreateInput): Promise<ProjectModel>{
        return this.projectService.addProject(project);
    }
}
