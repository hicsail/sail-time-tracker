import { DisplayCard } from '@components/DisplayCard.component';
import { Stack, Typography } from '@mui/material';
import { FC } from 'react';

interface InvoiceDisplayCardsProps {
  invoiceBillableHours: number | undefined;
  invoiceAmount: string | undefined;
  reportBillableHours: number | undefined;
  reportAmount: string | undefined;
  adjustingHours: string | undefined;
}

export const InvoiceDisplayCards: FC<InvoiceDisplayCardsProps> = ({ invoiceBillableHours, invoiceAmount, reportBillableHours, reportAmount, adjustingHours }) => {
  return (
    <Stack direction="row" justifyContent="space-between" gap={4}>
      <DisplayCard
        id="Invoice billable hours"
        title="Current Invoice Billable Hours"
        data={
          <Stack gap={1} direction="row" alignItems="center">
            {invoiceBillableHours}
            <Typography component="span" variant="caption" color="grey.500">
              hrs
            </Typography>
          </Stack>
        }
      />
      <DisplayCard id="Invoice Amount" title="Current Invoice Amount" data={invoiceAmount} />
      <DisplayCard
        id="Adjustment Hours"
        title="Adjustment Hours"
        data={
          <Stack gap={1} direction="row" alignItems="center">
            {adjustingHours}
            <Typography component="span" variant="caption" color="grey.500">
              hrs
            </Typography>
          </Stack>
        }
      />
      <DisplayCard
        id="Original Billable Hours"
        title="Report Billable Hours"
        data={
          <Stack gap={1} direction="row" alignItems="center">
            {reportBillableHours}
            <Typography component="span" variant="caption" color="grey.500">
              hrs
            </Typography>
          </Stack>
        }
      />
      <DisplayCard id="Report invoice Amount" title="Report Amount" data={reportAmount} />
    </Stack>
  );
};
