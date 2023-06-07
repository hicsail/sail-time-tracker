import { Args, Field, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { InvoiceService } from './invoice.service';
import { InvoiceModel } from './model/invoice.model';
import { InvoiceCreateInput } from './dto/invoice.dto';
import { BatchPayload } from '../favorite-project/model/favorite-project.model';
import { EmployeeModel } from '../employees/model/employee.model';
import { EmployeesService } from '../employees/employees.service';
import { ProjectModel } from '../project/model/project.model';
import { ProjectService } from '../project/project.service';

@Resolver(() => InvoiceModel)
export class InvoiceResolver {
  constructor(private invoiceService: InvoiceService, private employeeService: EmployeesService, private projectService: ProjectService) {}

  @Query(() => [InvoiceModel])
  async invoices(): Promise<InvoiceModel[]> {
    return this.invoiceService.getAllInvoices();
  }

  @ResolveField(() => EmployeeModel)
  async employee(@Parent() invoice: InvoiceModel): Promise<EmployeeModel> {
    return this.employeeService.getEmployeeById(invoice.employeeId);
  }

  @ResolveField(() => ProjectModel)
  async project(@Parent() invoice: InvoiceModel): Promise<ProjectModel> {
    return this.projectService.getProjectById(invoice.projectId);
  }

  @Mutation(() => BatchPayload)
  async createManyInvoice(
    @Args({
      name: 'invoices',
      type: () => [InvoiceCreateInput]
    })
    invoices: [InvoiceCreateInput]
  ): Promise<BatchPayload> {
    return this.invoiceService.createManyInvoice(invoices);
  }
}
