import { Controller, Post, Body } from '@nestjs/common';

import { EmployeesService } from './employees.service';

@Controller('employees')
export class EmployeesController {
  constructor(private employeesService: EmployeesService) {}

  @Post('employee')
  createEmployee(
    @Body()
    postData: {
      email: string;
      name: string;
      rate: string;
    }
  ): Promise<any> {
    let { email, name } = postData;
    let rate = parseFloat(postData.rate);
    return this.employeesService.createEmployee({
      email,
      name,
      rate
    });
  }
}
