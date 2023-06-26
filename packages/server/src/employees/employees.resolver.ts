import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { EmployeesService } from './employees.service';
import { EmployeeDeleteReturnModel, EmployeeModel, EmployeeWithRecord } from './model/employee.model';
import { EmployeeCreateInput, EmployeeUpdateInput } from './dto/employee.dto';
import { ProjectModel } from '../project/model/project.model';
import { GroupedRecordWithFavoriteProjectModel } from '../record/model/record.model';

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

  @Query(() => [EmployeeWithRecord])
  async getEmployeesWithRecord(@Args('startDate') startDate: Date, @Args('endDate') endDate: Date): Promise<EmployeeWithRecord[]> {
    return this.employeesService.getEmployeesWithRecord(startDate, endDate);
  }

  @ResolveField(() => [ProjectModel])
  async projects(@Parent() employee: EmployeeModel): Promise<ProjectModel[]> {
    return this.employeesService.getFavoriteProjects(employee.id);
  }

  @ResolveField(() => [GroupedRecordWithFavoriteProjectModel])
  async recordsWithFavoriteProjects(
    @Parent() employee: EmployeeModel,
    @Args('startDate') startDate: Date,
    @Args('endDate') endDate: Date
  ): Promise<GroupedRecordWithFavoriteProjectModel[]> {
    return this.employeesService.getRecordsWithFavoriteProject(employee.id, startDate, endDate);
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
  async deleteEmployees(@Args({ name: 'ids', type: () => [String] }) ids: string[]): Promise<EmployeeDeleteReturnModel> {
    return this.employeesService.deleteEmployees(ids);
  }
}
