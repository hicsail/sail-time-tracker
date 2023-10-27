import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceResolver } from './invoice.resolver';
import { PrismaModule } from 'nestjs-prisma';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [PrismaModule.forRoot(), HttpModule, ConfigModule, EmployeesModule],
  providers: [InvoiceService, InvoiceResolver]
})
export class InvoiceModule {}
