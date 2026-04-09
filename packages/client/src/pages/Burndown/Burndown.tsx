import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Paper,
  Stack,
  TextField,
  Slider,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  ListSubheader,
  useTheme
} from '@mui/material';
import { ComposedChart, Bar, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';
import { format, parseISO, eachMonthOfInterval, startOfMonth, endOfMonth, subMonths, addMonths, subWeeks, isAfter } from 'date-fns';
import { useGetBurndownDataQuery, BudgetAdjustment, DailySpendRecord, InvoiceRecord } from '@graphql/budget/budget';
import { useGetProjectListQuery } from '@graphql/project/project';
import { useGetProjectWithEmployeeRecordsQuery } from '@graphql/employee/employee';
import { StyledDatePicker } from '@components/StyledDatePicker';
import { DateRangePresets } from '@components/DateRangePresets';
import { formatDateToDashFormat } from '../../utils/helperFun';

const fmt = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);

// Budget available at a date = sum of adjustments up to that date
// Invoices represent spend (billed labor), not budget inflows — only adjustments drive the budget line
function budgetAvailableAt(date: Date, adjustments: BudgetAdjustment[]): number {
  let total = 0;
  for (const adj of adjustments) {
    if (!isAfter(parseISO(adj.date), date)) total += adj.amount;
  }
  return total;
}

function buildChartData(
  startDate: Date,
  endDate: Date,
  invoices: InvoiceRecord[],
  adjustments: BudgetAdjustment[],
  effectiveSpendByMonth: Map<string, number>,
  invoicedMonths: Set<string>,
  projectedMonthlyCost: number,
  projectRate: number
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayMonthKey = format(today, 'yyyy-MM');

  // Pre-seed cumulative spend with months before the display window
  let cumulativeSpend = 0;
  const displayStartKey = format(startOfMonth(startDate), 'yyyy-MM');
  for (const [key, spend] of effectiveSpendByMonth) {
    if (key < displayStartKey) cumulativeSpend += spend;
  }

  const months = eachMonthOfInterval({ start: startOfMonth(startDate), end: endDate });
  let projectedCumulative = 0;
  let projectionSeeded = false;
  let projectionBaseline = 0; // set when processing current month

  return months.map((monthStart) => {
    const monthEnd = endOfMonth(monthStart);
    const monthKey = format(monthStart, 'yyyy-MM');
    const isCurrentMonth = monthKey === todayMonthKey;
    const isFutureMonth = isAfter(monthStart, today);

    const monthEffectiveSpend = effectiveSpendByMonth.get(monthKey) ?? 0;
    if (!isFutureMonth) cumulativeSpend += monthEffectiveSpend;

    const budget = budgetAvailableAt(monthEnd, adjustments);
    const projectedFullMonthHours = projectedMonthlyCost / projectRate;
    // For the current month, include estimated remaining cost in the remaining line
    const currentMonthEstCost = isCurrentMonth && monthEffectiveSpend < projectedMonthlyCost ? projectedMonthlyCost - monthEffectiveSpend : 0;
    const remaining = budget - cumulativeSpend - currentMonthEstCost;

    // Record the projected end-of-current-month baseline so future projection continues from there
    if (isCurrentMonth) projectionBaseline = cumulativeSpend + currentMonthEstCost;

    let projectedRemaining: number | null = null;
    if (isFutureMonth) {
      if (!projectionSeeded) {
        projectedCumulative = projectionBaseline;
        projectionSeeded = true;
      }
      projectedCumulative += projectedMonthlyCost;
      projectedRemaining = budget - projectedCumulative;
    } else if (isCurrentMonth) {
      projectedRemaining = remaining;
    }

    const hasInvoice = invoicedMonths.has(monthKey);
    const monthHours = monthEffectiveSpend / projectRate;
    const invoiceHours = !isFutureMonth && hasInvoice ? monthHours : null;
    const trackerHours = !isFutureMonth && !hasInvoice ? monthHours : null;
    const projectedMonthlyHours = isFutureMonth ? projectedFullMonthHours : null;
    // Current month: stack estimated remaining on top of actual hours (capped so total = max(actual, est))
    const currentMonthEstRemaining = isCurrentMonth && monthHours < projectedFullMonthHours ? projectedFullMonthHours - monthHours : null;

    return {
      label: format(monthStart, 'MMM yyyy'),
      budget,
      remaining: isFutureMonth ? null : remaining,
      projectedRemaining,
      invoiceHours,
      trackerHours,
      currentMonthEstRemaining,
      projectedMonthlyHours
    };
  });
}

function StatCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <Paper sx={{ p: 2, flex: 1, minWidth: 140 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h6" fontWeight={600} color={color}>
        {value}
      </Typography>
    </Paper>
  );
}

export const Burndown = () => {
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  const [projectId, setProjectId] = useState(() => searchParams.get('project') ?? '');
  const [startDate, setStartDate] = useState<Date>(() => {
    const p = searchParams.get('start');
    if (p) return parseISO(p);
    const today = new Date();
    const fyStartYear = today.getMonth() >= 6 ? today.getFullYear() : today.getFullYear() - 1;
    return new Date(fyStartYear, 6, 1); // July 1
  });
  const [endDate, setEndDate] = useState<Date>(() => {
    const p = searchParams.get('end');
    if (p) return parseISO(p);
    const today = new Date();
    const fyStartYear = today.getMonth() >= 6 ? today.getFullYear() : today.getFullYear() - 1;
    return new Date(fyStartYear + 1, 5, 30); // June 30
  });
  const [customHoursStr, setCustomHoursStr] = useState(() => searchParams.get('hours') ?? '');

  // Keep URL params in sync with state
  useEffect(() => {
    const params: Record<string, string> = {};
    if (projectId) params.project = projectId;
    params.start = format(startDate, 'yyyy-MM-dd');
    params.end = format(endDate, 'yyyy-MM-dd');
    if (customHoursStr) params.hours = customHoursStr;
    setSearchParams(params, { replace: true });
  }, [projectId, startDate, endDate, customHoursStr]);

  const { data: projectsData } = useGetProjectListQuery();

  const recentEnd = formatDateToDashFormat(new Date()) as string;
  const recentStart = formatDateToDashFormat(subWeeks(new Date(), 8)) as string;
  const { data: recentRecordsData } = useGetProjectWithEmployeeRecordsQuery({
    variables: { startDate: recentStart, endDate: recentEnd }
  });

  const projects = useMemo(() => {
    const allBillable = (projectsData?.projects ?? []).filter((p) => p.isBillable);
    const recentHoursByProject = new Map<string, number>();
    for (const p of recentRecordsData?.getProjectWithEmployeeRecords ?? []) {
      if (p.workHours > 0) recentHoursByProject.set(p.id, p.workHours);
    }
    return [...allBillable].sort((a, b) => {
      const aHours = recentHoursByProject.get(a.id) ?? 0;
      const bHours = recentHoursByProject.get(b.id) ?? 0;
      if (aHours !== bHours) return bHours - aHours; // most recent hours first
      if (a.status !== b.status) return a.status === 'Active' ? -1 : 1; // active before inactive
      return a.name.localeCompare(b.name);
    });
  }, [projectsData, recentRecordsData]);

  const { data, loading, error } = useGetBurndownDataQuery(
    {
      projectId,
      startDate: formatDateToDashFormat(startDate) as string,
      endDate: formatDateToDashFormat(endDate) as string
    },
    { skip: !projectId }
  );

  const burndown = data?.getBurndownData;

  const hasBudget = burndown && (burndown.invoices.length > 0 || burndown.adjustments.length > 0);
  const hasData = !!burndown;
  const rate = burndown?.projectRate ?? 1;

  // Effective spend per month: invoice amounts override tracker for invoiced months
  const { effectiveSpendByMonth, invoicedMonths } = useMemo(() => {
    const invoicedMonths = new Set<string>();
    const invoiceAmountByMonth = new Map<string, number>();
    if (burndown) {
      for (const inv of burndown.invoices) {
        const invStart = parseISO(inv.startDate.split('T')[0]);
        const invEnd = parseISO(inv.endDate.split('T')[0]);
        const invMonths = eachMonthOfInterval({ start: startOfMonth(invStart), end: invEnd });
        const perMonth = inv.amount / invMonths.length;
        for (const m of invMonths) {
          const key = format(m, 'yyyy-MM');
          invoicedMonths.add(key);
          invoiceAmountByMonth.set(key, (invoiceAmountByMonth.get(key) ?? 0) + perMonth);
        }
      }
    }
    const trackerByMonth = new Map<string, number>();
    if (burndown) {
      for (const r of burndown.dailyRecords) {
        const key = format(parseISO(r.date.split('T')[0]), 'yyyy-MM');
        trackerByMonth.set(key, (trackerByMonth.get(key) ?? 0) + r.cost);
      }
    }
    const effectiveSpendByMonth = new Map<string, number>();
    for (const key of new Set([...trackerByMonth.keys(), ...invoiceAmountByMonth.keys()])) {
      effectiveSpendByMonth.set(key, invoicedMonths.has(key) ? invoiceAmountByMonth.get(key) ?? 0 : trackerByMonth.get(key) ?? 0);
    }
    return { effectiveSpendByMonth, invoicedMonths };
  }, [burndown]);

  // Avg monthly spend (hours×rate) over last 6 completed months — uses effective spend
  const avgMonthlySpend = useMemo(() => {
    let total = 0;
    for (let i = 1; i <= 6; i++) {
      total += effectiveSpendByMonth.get(format(subMonths(new Date(), i), 'yyyy-MM')) ?? 0;
    }
    return total / 6;
  }, [effectiveSpendByMonth]);

  // Spend (hours×rate) within the selected date range up to today — uses effective spend
  const totalSpent = useMemo(() => {
    const startKey = format(startOfMonth(startDate), 'yyyy-MM');
    const endKey = format(endDate, 'yyyy-MM');
    const todayKey = format(new Date(), 'yyyy-MM');
    let total = 0;
    for (const [key, spend] of effectiveSpendByMonth) {
      if (key >= startKey && key <= endKey && key <= todayKey) total += spend;
    }
    return total;
  }, [effectiveSpendByMonth, startDate, endDate]);

  // Budget = invoices received + adjustments within the selected range
  const totalBudget = useMemo(() => {
    if (!burndown) return 0;
    const startKey = format(startOfMonth(startDate), 'yyyy-MM');
    const endKey = format(endDate, 'yyyy-MM');

    const invoiceTotal = burndown.invoices
      .filter((inv) => {
        const key = format(parseISO(inv.startDate.split('T')[0]), 'yyyy-MM');
        return key >= startKey && key <= endKey;
      })
      .reduce((s, inv) => s + inv.amount, 0);

    const adjustmentTotal = burndown.adjustments
      .filter((a) => {
        const key = format(parseISO(a.date.split('T')[0]), 'yyyy-MM');
        return key >= startKey && key <= endKey;
      })
      .reduce((s, a) => s + a.amount, 0);

    return invoiceTotal + adjustmentTotal;
  }, [burndown, startDate, endDate]);

  const projectedMonthlyHours = customHoursStr ? parseFloat(customHoursStr) || 0 : avgMonthlySpend / rate;
  const projectedMonthlyCost = projectedMonthlyHours * rate;

  const chartData = useMemo(() => {
    if (!burndown) return [];
    return buildChartData(startDate, endDate, burndown.invoices, burndown.adjustments, effectiveSpendByMonth, invoicedMonths, projectedMonthlyCost, rate);
  }, [burndown, startDate, endDate, effectiveSpendByMonth, invoicedMonths, projectedMonthlyCost, rate]);

  // Total hours worked within range — derived from effective spend
  const totalHours = useMemo(() => {
    const startKey = format(startOfMonth(startDate), 'yyyy-MM');
    const endKey = format(endDate, 'yyyy-MM');
    const todayKey = format(new Date(), 'yyyy-MM');
    let total = 0;
    for (const [key, spend] of effectiveSpendByMonth) {
      if (key >= startKey && key <= endKey && key <= todayKey) total += spend / rate;
    }
    return total;
  }, [effectiveSpendByMonth, startDate, endDate, rate]);

  // Total invoiced within range
  const totalInvoiced = useMemo(() => {
    if (!burndown) return 0;
    const startKey = format(startOfMonth(startDate), 'yyyy-MM');
    const endKey = format(endDate, 'yyyy-MM');
    return burndown.invoices
      .filter((inv) => {
        const key = format(parseISO(inv.startDate.split('T')[0]), 'yyyy-MM');
        return key >= startKey && key <= endKey;
      })
      .reduce((s, inv) => s + inv.amount, 0);
  }, [burndown, startDate, endDate]);

  // All-time remaining: total funds received to today minus all-time effective spend
  const currentRemaining = useMemo(() => {
    if (!burndown) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayKey = format(today, 'yyyy-MM');
    const budget = budgetAvailableAt(today, burndown.adjustments);
    let spent = 0;
    for (const [key, spend] of effectiveSpendByMonth) {
      if (key <= todayKey) spent += spend;
    }
    return budget - spent;
  }, [burndown, effectiveSpendByMonth]);

  const hoursRemaining = hasBudget ? currentRemaining / rate : null;
  const monthsRemaining = projectedMonthlyCost > 0 && hasBudget ? currentRemaining / projectedMonthlyCost : null;
  const estimatedZeroDate = monthsRemaining !== null && monthsRemaining > 0 ? addMonths(new Date(), monthsRemaining) : null;
  const estimatedZeroLabel = estimatedZeroDate ? `Week ${Math.ceil(estimatedZeroDate.getDate() / 7)} of ${format(estimatedZeroDate, 'MMM yyyy')}` : null;

  const todayLabel = format(new Date(), 'MMM yyyy');
  const firstFutureLabel = chartData.find((d) => d.projectedMonthlyHours !== null)?.label ?? null;

  // Gradient split point: where 0 sits between the chart's max and min remaining
  const zeroGradientOffset = useMemo(() => {
    const values = chartData.map((d) => d.remaining).filter((v): v is number => v !== null);
    if (!values.length) return '100%';
    const maxV = Math.max(...values, 0);
    const minV = Math.min(...values, 0);
    if (maxV === minV) return maxV >= 0 ? '0%' : '100%';
    return `${((maxV / (maxV - minV)) * 100).toFixed(1)}%`;
  }, [chartData]);

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Budget Burndown
      </Typography>

      {/* Controls */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3} alignItems="center" flexWrap="wrap">
        <FormControl sx={{ width: 220 }}>
          <InputLabel>Project</InputLabel>
          <Select value={projectId} label="Project" onChange={(e: SelectChangeEvent) => setProjectId(e.target.value)}>
            {(() => {
              const recentHoursByProject = new Map((recentRecordsData?.getProjectWithEmployeeRecords ?? []).filter((p) => p.workHours > 0).map((p) => [p.id, p.workHours]));
              const withHours = projects.filter((p) => recentHoursByProject.has(p.id));
              const withoutHours = projects.filter((p) => !recentHoursByProject.has(p.id));
              const items: React.ReactNode[] = [];
              if (withHours.length > 0) {
                items.push(<ListSubheader key="recent-header">Recent activity</ListSubheader>);
                withHours.forEach((p) =>
                  items.push(
                    <MenuItem key={p.id} value={p.id}>
                      {p.name}
                    </MenuItem>
                  )
                );
              }
              if (withoutHours.length > 0) {
                items.push(<Divider key="divider" />);
                withoutHours.forEach((p) =>
                  items.push(
                    <MenuItem key={p.id} value={p.id} sx={p.status !== 'Active' ? { color: 'text.disabled' } : {}}>
                      {p.name}
                      {p.status !== 'Active' ? ' (inactive)' : ''}
                    </MenuItem>
                  )
                );
              }
              return items;
            })()}
          </Select>
        </FormControl>

        <StyledDatePicker label="From" value={startDate} onChange={(d: Date | null) => d && setStartDate(d)} />
        <StyledDatePicker label="To" value={endDate} onChange={(d: Date | null) => d && setEndDate(d)} />
        <DateRangePresets
          onApply={({ startDate: s, endDate: e }) => {
            setStartDate(s);
            setEndDate(e);
          }}
        />
      </Stack>

      {!projectId && (
        <Alert severity="info" sx={{ maxWidth: 500 }}>
          Select a project to view its budget burndown.
        </Alert>
      )}

      {projectId && loading && (
        <Box display="flex" justifyContent="center" mt={6}>
          <CircularProgress />
        </Box>
      )}

      {projectId && error && <Alert severity="error">Failed to load burndown data.</Alert>}

      {projectId && hasData && (
        <>
          {!hasBudget && (
            <Alert severity="info" sx={{ mb: 2 }}>
              No budget set — showing spend only. An admin can set monthly budgets under Admin › Budget.
            </Alert>
          )}

          {/* Stat cards */}
          <Stack direction="row" spacing={2} mb={3} sx={{ flexWrap: 'wrap', gap: 2 }}>
            {/* Total Hours + Total Invoiced combined */}
            <Paper sx={{ p: 2, flex: 1 }}>
              <Stack direction="row" alignItems="center" height="100%">
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Total Hours
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {totalHours.toFixed(0)} hrs
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Total Invoiced
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {fmt(totalInvoiced)}
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* Hours Remaining + Budget Remaining combined */}
            {(hoursRemaining !== null || hasBudget) && (
              <Paper sx={{ p: 2, flex: 1 }}>
                <Stack direction="row" alignItems="center" height="100%">
                  {hoursRemaining !== null && (
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Hours Remaining
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        {hoursRemaining.toFixed(0)} hrs
                      </Typography>
                    </Box>
                  )}
                  {hoursRemaining !== null && hasBudget && <Divider orientation="vertical" flexItem />}
                  {hasBudget && (
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Budget Remaining
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        {fmt(currentRemaining)}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Paper>
            )}
          </Stack>

          {/* Projection row: custom hours input + est zero date */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Stack direction="row" alignItems="center" spacing={3}>
              <Slider
                value={(() => {
                  const avg = avgMonthlySpend / rate;
                  const cur = parseFloat(customHoursStr) || avg;
                  const mult = avg > 0 ? cur / avg : 1;
                  return Math.min(2, Math.max(0.25, Math.round(mult * 4) / 4));
                })()}
                onChange={(_, v) => {
                  const avg = avgMonthlySpend / rate;
                  setCustomHoursStr(String(Math.round(avg * (v as number))));
                }}
                min={0.25}
                max={2}
                step={0.25}
                marks
                sx={{ width: 160 }}
              />
              <Chip label={`${(Math.round(((parseFloat(customHoursStr) || avgMonthlySpend / rate) / (avgMonthlySpend / rate || 1)) * 4) / 4).toFixed(2)}×`} size="small" />
              <TextField
                label="Monthly hours"
                type="number"
                size="small"
                value={customHoursStr}
                onChange={(e) => setCustomHoursStr(e.target.value)}
                placeholder={avgMonthlySpend > 0 ? String(Math.round(avgMonthlySpend / rate)) : '—'}
                inputProps={{ min: 0, step: 1 }}
                sx={{ width: 130 }}
                helperText="hrs / month"
              />
              <Divider orientation="vertical" flexItem />
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Proj. Monthly Hours
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {projectedMonthlyHours.toFixed(0)} hrs
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Est. Zero Date
                </Typography>
                <Typography variant="body1" fontWeight={600} color={!estimatedZeroLabel && hasBudget && currentRemaining <= 0 ? 'error.main' : 'text.primary'}>
                  {estimatedZeroLabel ?? (hasBudget && currentRemaining <= 0 ? 'Over budget' : '—')}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Combined chart */}
          <Paper sx={{ p: 2 }}>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={chartData} margin={{ top: 8, right: 24, left: 16, bottom: 8 }}>
                <defs>
                  <linearGradient id="remainingStroke" x1="0" y1="0" x2="0" y2="1">
                    <stop offset={zeroGradientOffset} stopColor={theme.palette.success.main} />
                    <stop offset={zeroGradientOffset} stopColor={theme.palette.error.main} />
                  </linearGradient>
                  <linearGradient id="remainingFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset={zeroGradientOffset} stopColor={theme.palette.success.main} stopOpacity={0.15} />
                    <stop offset={zeroGradientOffset} stopColor={theme.palette.error.main} stopOpacity={0.15} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={Math.floor(chartData.length / 8)} />
                <YAxis yAxisId="money" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} width={60} />
                <YAxis yAxisId="hours" orientation="right" tickFormatter={(v) => `${v}h`} tick={{ fontSize: 11 }} width={45} />
                <Tooltip
                  formatter={(value: any, name: string) => {
                    if (typeof value !== 'number') return [value, name];
                    if (['Invoice Hours', 'Tracker Hours', 'Est. Hours'].includes(name)) return [`${value.toFixed(1)} hrs`, name];
                    return [fmt(value), name];
                  }}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Legend />
                {firstFutureLabel && (
                  <ReferenceArea yAxisId="money" x1={firstFutureLabel} x2={chartData[chartData.length - 1]?.label} fill={theme.palette.action.selected} fillOpacity={0.4} />
                )}
                <ReferenceArea yAxisId="money" x1={todayLabel} x2={todayLabel} fill={theme.palette.action.hover} />
                <ReferenceLine
                  yAxisId="money"
                  y={0}
                  stroke={theme.palette.text.secondary}
                  strokeWidth={2}
                  strokeDasharray="4 2"
                  label={{ value: '$0', position: 'insideLeft', fontSize: 11, fill: theme.palette.text.secondary }}
                />
                <Bar yAxisId="hours" dataKey="invoiceHours" name="Invoice Hours" fill={theme.palette.success.main} opacity={0.8} stackId="hrs" />
                <Bar yAxisId="hours" dataKey="trackerHours" name="Tracker Hours" fill={theme.palette.primary.main} opacity={0.8} stackId="hrs" />
                <Bar yAxisId="hours" dataKey="currentMonthEstRemaining" name="Est. Remaining" fill={theme.palette.warning.main} opacity={0.4} stackId="hrs" />
                <Bar yAxisId="hours" dataKey="projectedMonthlyHours" name="Est. Hours" fill={theme.palette.warning.main} opacity={0.5} />
                <Area
                  yAxisId="money"
                  type="monotone"
                  dataKey="remaining"
                  name="Remaining"
                  stroke="url(#remainingStroke)"
                  fill="url(#remainingFill)"
                  dot={false}
                  strokeWidth={2}
                  connectNulls={false}
                />
                <Line
                  yAxisId="money"
                  type="monotone"
                  dataKey="projectedRemaining"
                  name="Proj. Remaining"
                  stroke={theme.palette.success.main}
                  dot={false}
                  strokeWidth={2}
                  strokeDasharray="6 3"
                  connectNulls={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Paper>
        </>
      )}
    </Box>
  );
};
