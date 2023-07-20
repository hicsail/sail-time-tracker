import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceResolver } from './invoice.resolver';
import { PrismaModule } from 'nestjs-prisma';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule.forRoot(), HttpModule, ConfigModule],
  providers: [InvoiceService, InvoiceResolver]
})
export class InvoiceModule {}
