import { Module } from '@nestjs/common';
import { BurndownService } from './burndown.service';
import { BurndownResolver } from './burndown.resolver';
import { RecordModule } from '../record/record.module';
import { ClickUpTaskModule } from '../click-up-task/click-up-task.module';

@Module({
  imports: [RecordModule, ClickUpTaskModule],
  providers: [BurndownService, BurndownResolver]
})
export class BurndownModule {}
