import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { PrismaModule } from 'nestjs-prisma';
import { EmployeesResolver } from './employees.resolver';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule.forRoot(), HttpModule, ConfigModule, UserModule],
  providers: [EmployeesService, EmployeesResolver],
  exports: [EmployeesService]
})
export class EmployeesModule {}
