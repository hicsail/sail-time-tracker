import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceResolver } from './invoice.resolver';
import { PrismaModule } from 'nestjs-prisma';
import { EmployeesModule } from '../employees/employees.module';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [PrismaModule.forRoot(), EmployeesModule, ProjectModule],
  providers: [InvoiceService, InvoiceResolver]
})
export class InvoiceModule {}
