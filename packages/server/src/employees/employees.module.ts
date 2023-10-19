import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { PrismaModule } from 'nestjs-prisma';
import { EmployeesResolver } from './employees.resolver';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule.forRoot(), HttpModule, ConfigModule],
  providers: [EmployeesService, EmployeesResolver],
  exports: [EmployeesService]
})
export class EmployeesModule {}
