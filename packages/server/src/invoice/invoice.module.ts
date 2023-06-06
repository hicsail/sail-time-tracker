import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceResolver } from './invoice.resolver';
import {PrismaModule} from "nestjs-prisma";

@Module({
  imports: [PrismaModule.forRoot()],
  providers: [InvoiceService, InvoiceResolver]
})
export class InvoiceModule {}
