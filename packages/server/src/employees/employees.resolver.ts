import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { EmployeesService } from './employees.service';
import { EmployeeDeleteReturnModel, EmployeeModel } from './model/employee.model';
import { EmployeeCreateInput, EmployeeUpdateInput } from './dto/employee.dto';
import { ProjectModel } from '../project/model/project.model';
import { RecordModelWithProject, RecordWithFavoriteProjectModel } from '../record/model/record.model';

@Resolver(() => EmployeeModel)
export class EmployeesResolver {
  constructor(private employeesService: EmployeesService) {}

  @Query(() => [EmployeeModel])
  async employees(): Promise<EmployeeModel[]> {
    return this.employeesService.getAllEmployees();
  }

  @Query(() => EmployeeModel)
  async employee(@Args('id') id: string): Promise<EmployeeModel> {
    return this.employeesService.getEmployeeById(id);
  }

  @ResolveField(() => [ProjectModel])
  async projects(@Parent() employee: EmployeeModel): Promise<ProjectModel[]> {
    return this.employeesService.getFavoriteProjects(employee.id);
  }

  @ResolveField(() => [RecordModelWithProject])
  async records(@Parent() employee: EmployeeModel, @Args('date') date: Date): Promise<RecordModelWithProject[]> {
    return this.employeesService.getRecords(employee.id, date);
  }

  @ResolveField(() => [RecordWithFavoriteProjectModel])
  async recordsWithFavoriteProjects(@Parent() employee: EmployeeModel, @Args('date') date: Date): Promise<RecordWithFavoriteProjectModel[]> {
    return this.employeesService.getRecordsWithFavoriteProject(employee.id, date);
  }

  @Mutation(() => EmployeeModel)
  async addEmployee(@Args('employee') employee: EmployeeCreateInput): Promise<EmployeeModel> {
    return this.employeesService.addEmployee(employee);
  }

  @Mutation(() => EmployeeModel)
  async updateEmployee(@Args('updateEmployee') updateEmployee: EmployeeUpdateInput): Promise<EmployeeModel> {
    return this.employeesService.updateEmployee(updateEmployee);
  }

  @Mutation(() => EmployeeDeleteReturnModel)
  async deleteEmployees(@Args({ name: 'ids', type: () => [String] }) ids: String[]): Promise<EmployeeDeleteReturnModel> {
    return this.employeesService.deleteEmployees(ids);
  }
}
