import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InvoiceService } from './invoice.service';
import { InvoiceModel } from './model/invoice.model';
import { InvoiceCreateInput } from './dto/invoice.dto';
import { BatchPayload } from '../favorite-project/model/favorite-project.model';

@Resolver()
export class InvoiceResolver {
  constructor(private invoiceService: InvoiceService) {}

  @Query(() => [InvoiceModel])
  async invoices(): Promise<InvoiceModel[]> {
    return this.invoiceService.getAllInvoices();
  }

  @Mutation(() => BatchPayload)
  async createManyInvoice(
    @Args({
      name: 'invoices',
      type: () => [InvoiceCreateInput]
    })
    invoices: [InvoiceCreateInput]
  ): Promise<BatchPayload> {
    return this.invoiceService.createManyInvoice(invoices);
  }
}
