import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InvoiceService } from './invoice.service';
import { InvoiceModel, InvoiceModelWithProject } from './model/invoice.model';
import { InvoiceCreateInput, InvoiceSearchInput } from './dto/invoice.dto';
import { Invoice } from '@prisma/client';

@Resolver(() => InvoiceModel)
export class InvoiceResolver {
  constructor(private invoiceService: InvoiceService) {}

  @Query(() => [InvoiceModelWithProject])
  async invoices(): Promise<InvoiceModelWithProject[]> {
    return this.invoiceService.getAllInvoices();
  }

  @Query(() => InvoiceModelWithProject)
  async searchInvoice(@Args('projectId_startDate_endDate') projectId_startDate_endDate: InvoiceSearchInput): Promise<InvoiceModelWithProject> {
    return this.invoiceService.searchInvoice(projectId_startDate_endDate);
  }

  @Mutation(() => InvoiceModel)
  async createOrUpdateInvoice(@Args('invoice') invoice: InvoiceCreateInput): Promise<Invoice> {
    return this.invoiceService.createOrUpdateInvoice(invoice);
  }
}
