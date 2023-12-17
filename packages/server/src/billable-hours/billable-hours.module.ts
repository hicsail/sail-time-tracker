import { Module } from '@nestjs/common';
import { BillableHoursService } from './billable-hours.service';
import { BillableHoursResolver } from './billable-hours.resolver';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [PrismaModule.forRoot()],
  providers: [BillableHoursService, BillableHoursResolver]
})
export class BillableHoursModule {}
