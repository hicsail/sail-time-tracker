import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import {Prisma, Invoice} from "@prisma/client";
import {InvoiceCreateInput} from "./dto/invoice.dto";

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}
  async getAllInvoices(): Promise<Invoice[]> {
    return this.prisma.invoice.findMany();
  }

  async createManyInvoice(invoices: InvoiceCreateInput[]): Promise<Prisma.BatchPayload> {
    return this.prisma.invoice.createMany({
      data: invoices
    });
  }

}
