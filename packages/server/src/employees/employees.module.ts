import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { PrismaModule } from 'nestjs-prisma';
import { EmployeesResolver } from './employees.resolver';

@Module({
  imports: [PrismaModule.forRoot()],
  providers: [EmployeesService, EmployeesResolver],
})

export class EmployeesModule {}
