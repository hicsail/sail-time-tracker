import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { BudgetService } from './budget.service';
import { BudgetResolver } from './budget.resolver';

@Module({
  imports: [PrismaModule.forRoot()],
  providers: [BudgetService, BudgetResolver]
})
export class BudgetModule {}
