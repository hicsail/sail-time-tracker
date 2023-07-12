import { Module } from '@nestjs/common';
import { ClickUpTaskService } from './click-up-task.service';
import { ClickUpTaskResolver } from './click-up-task.resolver';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [PrismaModule.forRoot(), HttpModule, ConfigModule],
  providers: [ClickUpTaskService, ClickUpTaskResolver]
})
export class ClickUpTaskModule {}
