import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InvoiceService } from './invoice.service';
import { InvoiceModel, InvoiceModelWithProject, InvoiceModelWithProjectAndComments } from './model/invoice.model';
import { InvoiceCreateInput, InvoiceSearchInput } from './dto/invoice.dto';
import { Invoice } from '@prisma/client';

@Resolver(() => InvoiceModel)
export class InvoiceResolver {
  constructor(private invoiceService: InvoiceService) {}

  @Query(() => [InvoiceModelWithProject])
  async invoices(): Promise<InvoiceModelWithProject[]> {
    return this.invoiceService.getAllInvoices();
  }

  @Query(() => InvoiceModelWithProjectAndComments)
  async searchInvoice(@Args('projectId_startDate_endDate') projectId_startDate_endDate: InvoiceSearchInput): Promise<InvoiceModelWithProjectAndComments> {
    return this.invoiceService.searchInvoice(projectId_startDate_endDate);
  }

  @Query(() => [InvoiceModel])
  async searchInvoicesByDateRange(@Args('startDate') startDate: Date, @Args('endDate') endDate: Date): Promise<InvoiceModel[]> {
    return this.invoiceService.searchInvoicesByDateRange(startDate, endDate);
  }

  @Query(() => InvoiceModelWithProjectAndComments, { nullable: true })
  async findPreviousInvoice(@Args('projectId') projectId: string, @Args('startDate') startDate: Date): Promise<InvoiceModelWithProjectAndComments | null> {
    return this.invoiceService.findPreviousInvoice(projectId, startDate);
  }

  @Query(() => InvoiceModelWithProjectAndComments, { nullable: true })
  async findNextInvoice(@Args('projectId') projectId: string, @Args('endDate') endDate: Date): Promise<InvoiceModelWithProjectAndComments | null> {
    return this.invoiceService.findNextInvoice(projectId, endDate);
  }

  @Mutation(() => InvoiceModel)
  async createOrUpdateInvoice(@Args('invoice') invoice: InvoiceCreateInput): Promise<Invoice> {
    return this.invoiceService.createOrUpdateInvoice(invoice);
  }

  @Mutation(() => InvoiceModel)
  async deleteInvoice(@Args('projectId_startDate_endDate') projectId_startDate_endDate: InvoiceSearchInput): Promise<Invoice> {
    return this.invoiceService.deleteInvoice(projectId_startDate_endDate);
  }
}
