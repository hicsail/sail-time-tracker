import { DisplayCard } from '@components/DisplayCard.component';
import { Stack, Typography } from '@mui/material';
import { FC } from 'react';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import RemoveIcon from '@mui/icons-material/Remove';

interface InvoiceDisplayCardsProps {
  invoiceBillableHours: number | undefined;
  invoiceAmount: string | undefined;
  reportBillableHours: number | undefined;
  reportAmount: string | undefined;
  adjustingHours: string | undefined;
}

export const InvoiceDisplayCards: FC<InvoiceDisplayCardsProps> = ({ invoiceBillableHours, invoiceAmount, reportBillableHours, reportAmount, adjustingHours }) => {
  const iconRender = () => {
    if (invoiceBillableHours && reportBillableHours) {
      if (invoiceBillableHours > reportBillableHours) {
        return <ArrowUpwardIcon sx={{ color: 'success.main' }} />;
      } else if (invoiceBillableHours < reportBillableHours) {
        return <ArrowDownwardIcon sx={{ color: 'error.main' }} />;
      } else {
        return <RemoveIcon sx={{ color: 'grey.500' }} />;
      }
    }
  };
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
            {iconRender()}
          </Stack>
        }
      />
      <DisplayCard
        id="Invoice Amount"
        title="Current Invoice Amount"
        data={
          <Stack gap={1} direction="row" alignItems="center">
            {invoiceAmount}
            {iconRender()}
          </Stack>
        }
      />
      <DisplayCard
        id="Adjustment Hours"
        title="Adjustment Hours"
        data={
          <Stack gap={1} direction="row" alignItems="center">
            {adjustingHours}
            <Typography component="span" variant="caption" color="grey.500">
              hrs
            </Typography>
            {iconRender()}
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
