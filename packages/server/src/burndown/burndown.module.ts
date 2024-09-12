import { Module } from '@nestjs/common';
import { BurndownService } from './burndown.service';
import { BurndownResolver } from './burndown.resolver';
import { RecordModule } from '../record/record.module';
import { ClickUpTaskModule } from '../click-up-task/click-up-task.module';
import { PrismaModule } from 'nestjs-prisma';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [RecordModule, ClickUpTaskModule, PrismaModule.forRoot(), ConfigModule],
  providers: [BurndownService, BurndownResolver]
})
export class BurndownModule {}
