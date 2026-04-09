import { useState } from 'react';
import { IconButton, ListSubheader, Menu, MenuItem, Tooltip } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { startOfMonth, lastDayOfMonth, subMonths, startOfYear, endOfYear, subYears } from 'date-fns';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface DateRangePresetsProps {
  onApply: (range: DateRange) => void;
}

// Fiscal year runs July 1 – June 30
function fiscalYear(offset = 0): DateRange {
  const today = new Date();
  const calYear = today.getFullYear();
  // FY start is July 1 — if we're before July, the current FY started last calendar year
  const fyStartYear = today.getMonth() >= 6 ? calYear : calYear - 1;
  const start = new Date(fyStartYear + offset, 6, 1);      // July 1
  const end   = new Date(fyStartYear + offset + 1, 5, 30); // June 30
  return { startDate: start, endDate: end };
}

function fiscalYearLabel(offset = 0): string {
  const { startDate, endDate } = fiscalYear(offset);
  return `FY ${startDate.getFullYear()}–${String(endDate.getFullYear()).slice(2)}`;
}

export const DateRangePresets = ({ onApply }: DateRangePresetsProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const apply = (range: DateRange) => {
    onApply(range);
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Quick select">
        <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
          <AccessTimeIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <ListSubheader>Calendar</ListSubheader>
        <MenuItem onClick={() => apply((() => { const m = subMonths(new Date(), 1); return { startDate: startOfMonth(m), endDate: lastDayOfMonth(m) }; })())}>Last Month</MenuItem>
        <MenuItem onClick={() => apply({ startDate: startOfMonth(new Date()), endDate: lastDayOfMonth(new Date()) })}>This Month</MenuItem>
        <MenuItem onClick={() => apply({ startDate: startOfYear(new Date()), endDate: new Date() })}>Year to Date</MenuItem>
        <MenuItem onClick={() => apply((() => { const y = subYears(new Date(), 1); return { startDate: startOfYear(y), endDate: endOfYear(y) }; })())}>Last Year</MenuItem>
        <ListSubheader>Fiscal Year (Jul–Jun)</ListSubheader>
        <MenuItem onClick={() => apply(fiscalYear(0))}>{fiscalYearLabel(0)} (Current)</MenuItem>
        <MenuItem onClick={() => apply(fiscalYear(-1))}>{fiscalYearLabel(-1)} (Last)</MenuItem>
        <MenuItem onClick={() => apply(fiscalYear(-2))}>{fiscalYearLabel(-2)}</MenuItem>
      </Menu>
    </>
  );
};
