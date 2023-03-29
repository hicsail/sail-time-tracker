import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { EmployeesService } from './employees.service';
import { EmployeeModel } from './model/employee.model';
import { EmployeeCreateInput, EmployeeUpdateInput } from './dto/employee.dto';
import { CountModel } from './model/employee.model';

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

  @Mutation(() => EmployeeModel)
  async addEmployee(@Args('employee') employee: EmployeeCreateInput): Promise<EmployeeModel> {
    return this.employeesService.addEmployee(employee);
  }

  @Mutation(() => EmployeeModel)
  async updateEmployee(@Args('updateEmployee') updateEmployee: EmployeeUpdateInput): Promise<EmployeeModel> {
    return this.employeesService.updateEmployee(updateEmployee);
  }

  @Mutation(() => CountModel)
  async deleteEmployees(@Args({ name: 'ids', type: () => [String] }) ids: String[]): Promise<CountModel> {
    return this.employeesService.deleteEmployees(ids);
  }
}
