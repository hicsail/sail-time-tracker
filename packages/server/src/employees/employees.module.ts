import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { PrismaModule } from 'nestjs-prisma';
import { EmployeesResolver } from './employees.resolver';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { BillableHoursModule } from '../billable-hours/billable-hours.module';

@Module({
  imports: [PrismaModule.forRoot(), HttpModule, ConfigModule, BillableHoursModule],
  providers: [EmployeesService, EmployeesResolver],
  exports: [EmployeesService]
})
export class EmployeesModule {}
