import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Stack,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Divider,
  ListSubheader,
  Alert,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { format, parseISO, subWeeks } from 'date-fns';
import { useGetProjectListQuery } from '@graphql/project/project';
import { useGetProjectWithEmployeeRecordsQuery } from '@graphql/employee/employee';
import { formatDateToDashFormat } from '../../../utils/helperFun';
import { useGetProjectAdjustmentsQuery, useAddBudgetAdjustmentMutation, useDeleteBudgetAdjustmentMutation } from '@graphql/budget/budget';
import { StyledDatePicker } from '@components/StyledDatePicker';

const fmt = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);

export const Budget = () => {
  const [projectId, setProjectId] = useState('');

  // Adjustment form state
  const [adjDate, setAdjDate] = useState<Date | null>(new Date());
  const [adjAmount, setAdjAmount] = useState('');
  const [adjNote, setAdjNote] = useState('');

  const { data: projectsData } = useGetProjectListQuery();

  const recentEnd = formatDateToDashFormat(new Date()) as string;
  const recentStart = formatDateToDashFormat(subWeeks(new Date(), 8)) as string;
  const { data: recentRecordsData } = useGetProjectWithEmployeeRecordsQuery({
    variables: { startDate: recentStart, endDate: recentEnd }
  });

  const { withHours, activeNoHours, inactive } = useMemo(() => {
    const all = projectsData?.projects ?? [];
    const recentHours = new Map<string, number>((recentRecordsData?.getProjectWithEmployeeRecords ?? []).filter((p) => p.workHours > 0).map((p) => [p.id, p.workHours]));
    const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name);
    return {
      withHours: all.filter((p) => recentHours.has(p.id)).sort((a, b) => (recentHours.get(b.id) ?? 0) - (recentHours.get(a.id) ?? 0)),
      activeNoHours: all.filter((p) => p.status === 'Active' && !recentHours.has(p.id)).sort(byName),
      inactive: all.filter((p) => p.status !== 'Active' && !recentHours.has(p.id)).sort(byName)
    };
  }, [projectsData, recentRecordsData]);

  const { data: adjustmentsData, refetch: refetchAdjustments } = useGetProjectAdjustmentsQuery(projectId, !projectId);

  const adjustments = adjustmentsData?.getProjectAdjustments ?? [];

  const [addAdjustment, { loading: savingAdj }] = useAddBudgetAdjustmentMutation();
  const [deleteAdjustment] = useDeleteBudgetAdjustmentMutation();

  const handleAddAdjustment = async () => {
    const amount = parseFloat(adjAmount);
    if (!projectId || isNaN(amount) || !adjDate) return;
    await addAdjustment({
      variables: {
        input: {
          projectId,
          date: adjDate.toISOString(),
          amount,
          note: adjNote || null
        }
      }
    });
    setAdjAmount('');
    setAdjNote('');
    refetchAdjustments();
  };

  const handleDeleteAdjustment = async (id: string) => {
    await deleteAdjustment({ variables: { id } });
    refetchAdjustments();
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Budget Management
      </Typography>

      {/* Project selector */}
      <FormControl size="small" sx={{ minWidth: 260, mb: 4 }}>
        <InputLabel>Project</InputLabel>
        <Select value={projectId} label="Project" onChange={(e: SelectChangeEvent) => setProjectId(e.target.value)}>
          {[
            withHours.length > 0 && <ListSubheader key="h-recent">Recent activity</ListSubheader>,
            ...withHours.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            )),
            (withHours.length > 0 || activeNoHours.length > 0) && inactive.length > 0 && <Divider key="d1" />,
            ...activeNoHours.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            )),
            inactive.length > 0 && <ListSubheader key="h-inactive">Inactive</ListSubheader>,
            ...inactive.map((p) => (
              <MenuItem key={p.id} value={p.id} sx={{ color: 'text.disabled' }}>
                {p.name}
              </MenuItem>
            ))
          ]}
        </Select>
      </FormControl>

      {!projectId && <Alert severity="info">Select a project to manage its budget adjustments.</Alert>}

      {projectId && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} mb={1}>
            Budget Adjustments
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Use positive amounts to add funds, negative to reduce.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3} alignItems="flex-end">
            <StyledDatePicker label="Date" value={adjDate} onChange={(d: Date | null) => setAdjDate(d)} slotProps={{ textField: { size: 'small' } }} />
            <TextField
              label="Amount ($)"
              type="number"
              size="small"
              value={adjAmount}
              onChange={(e) => setAdjAmount(e.target.value)}
              sx={{ width: 160 }}
              placeholder="e.g. 10000 or -5000"
            />
            <TextField label="Note (optional)" size="small" value={adjNote} onChange={(e) => setAdjNote(e.target.value)} sx={{ width: 220 }} />
            <Button
              variant="contained"
              startIcon={savingAdj ? <CircularProgress size={16} /> : <AddIcon />}
              onClick={handleAddAdjustment}
              disabled={!adjAmount || !adjDate || savingAdj}
            >
              Add
            </Button>
          </Stack>

          {adjustments.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No adjustments recorded yet.
            </Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Note</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {adjustments.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>{format(parseISO(a.date), 'MMM d, yyyy')}</TableCell>
                    <TableCell align="right" sx={{ color: a.amount >= 0 ? 'success.main' : 'error.main' }}>
                      {a.amount >= 0 ? '+' : ''}
                      {fmt(a.amount)}
                    </TableCell>
                    <TableCell>{a.note ?? '—'}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleDeleteAdjustment(a.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      )}
    </Box>
  );
};
