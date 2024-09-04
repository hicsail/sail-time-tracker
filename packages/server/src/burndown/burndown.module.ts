import { Module } from '@nestjs/common';
import { BurndownService } from './burndown.service';
import { BurndownResolver } from './burndown.resolver';

@Module({
  providers: [BurndownService, BurndownResolver]
})
export class BurndownModule {}
