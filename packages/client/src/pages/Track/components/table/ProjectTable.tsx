import * as Yup from 'yup';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Save } from '@mui/icons-material';
import { ChangeEvent, useEffect, useState, MouseEvent, FC } from 'react';

import { EnhancedTableToolbar } from '@pages/Track/components/table/EnhancedTableToolbar';
import { EnhancedTableHead } from '@pages/Track/components/table/EnhancedTableHead';

import { Form, Formik } from 'formik';
import { ObserverTextInput } from '@components/form/ObserverTextInput';
import { FormObserver } from '@pages/Track/components/table/FormObserver';
import { useDate } from '@context/date.context';
import { useEmployee } from '@context/employee.context';
import { GetRecordWithFavoriteProjectQuery } from '@graphql/employee/employee';

export interface Data {
  id: string;
  name: string;
  hours?: number;
  description: string;
  status: string;
  isFavorite: boolean;
  previousWeek?: number;
}

interface ProjectTableProps {
  data: GetRecordWithFavoriteProjectQuery | undefined;
}
export const ProjectTable: FC<ProjectTableProps> = ({ data }) => {
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Data[]>([]);
  const { employeeId } = useEmployee();
  const { date } = useDate();

  useEffect(() => {
    data ? setRows(data.employee.recordsWithFavoriteProjects) : setRows([]);
  }, [data]);

  const FormValidation = Yup.object({
    hours: Yup.number().required('Required').min(0, 'Hours can not be negative.')
  });

  /**
   * this method is used to handle select all project event.
   * @param event
   */
  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const filteredSelected = rows.filter((n: Data, index) => index !== 1 && index !== 0).map((n: Data) => n.id);
      return setSelected(filteredSelected);
    }
    return setSelected([]);
  };

  /**
   * this method is used to handle select single project event.
   * @param event
   * @param id
   */
  const handleClick = (event: MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };

  const isSelected = (id: string) => {
    return selected.indexOf(id) !== -1;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          mb: 2,
          backgroundColor: 'customColors.sidebarBg',
          padding: '1rem'
        }}
      >
        <EnhancedTableToolbar numSelected={selected.length} selected={selected} setSelected={setSelected} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <EnhancedTableHead numSelected={selected.length} onSelectAllClick={handleSelectAllClick} rowCount={rows.length} />
            <TableBody>
              {rows.map((row: Data, index: number) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow hover role="checkbox" aria-checked={isItemSelected} tabIndex={-1} key={row.id} selected={isItemSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        onClick={(event) => handleClick(event, row.id)}
                        inputProps={{
                          'aria-labelledby': labelId
                        }}
                        disabled={index === 0 || index === 1}
                      />
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row" padding="none">
                      {row.name}
                    </TableCell>
                    <TableCell align="left" sx={{ width: '180px', paddingRight: '3rem', paddingLeft: '0' }}>
                      <Formik
                        validateOnChange={true}
                        initialValues={row.hours ? { hours: row.hours.toString() } : { hours: '0' }}
                        validationSchema={FormValidation}
                        enableReinitialize={true}
                        onSubmit={() => {}}
                      >
                        <Form>
                          <FormObserver employeeId={employeeId as string} projectId={row.id} date={date} setLoading={setLoading} />
                          <ObserverTextInput id="hours" name="hours" type="number" label="Hours" variant="outlined" InputProps={{ inputProps: { min: 0 } }} required />
                        </Form>
                      </Formik>
                    </TableCell>
                    <TableCell align="left" sx={{ width: '150px', paddingRight: '3rem' }}>
                      {row.previousWeek}
                    </TableCell>
                    <TableCell align="left">{row.description}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {rows.length == 0 && <Button sx={{ width: '100%', height: '200px', fontSize: '1.2rem' }}>Add Your First Favorite Project</Button>}
      </Paper>

      <LoadingButton color="primary" loading={loading} loadingPosition="start" startIcon={<Save />} variant="contained">
        <span>Save</span>
      </LoadingButton>
    </Box>
  );
};
