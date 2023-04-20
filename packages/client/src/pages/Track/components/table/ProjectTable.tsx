import * as Yup from 'yup';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Save } from '@mui/icons-material';
import { useState } from 'react';

import { EnhancedTableToolbar } from '@pages/Track/components/table/EnhancedTableToolbar';
import { EnhancedTableHead } from '@pages/Track/components/table/EnhancedTableHead';
import { ApolloError } from '@apollo/client';
import { Form, Formik } from 'formik';
import { TextInput } from '@components/form/TextInput';
import { FormObserver } from '@pages/Track/components/table/FormObserver';
import { useDate } from '@context/date.context';

export interface Data {
  id: string;
  name: string;
  hours?: number;
  previousWeek?: number;
  description: string;
  status: string;
}

export const ProjectTable = () => {
  const [initialHours, setInitialHours] = useState<{ hours: number }>({ hours: 0 });
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [loading, setLoading] = useState(false);
  const { date } = useDate();
  const {
    employeeData: { projects: rows },
    employeeLoading,
    employeeError
  } = data;
  const [initialHours, setInitialHours] = useState<{ hours: number }>({ hours: 0 });

  const FormValidation = Yup.object({
    hours: Yup.number().required('Required').min(0, 'Hours can not be negative.')
  });

  /**
   * this method is used to handle select all project event.
   * @param event
   */
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n: Data) => n.name);

      // remove "Indirect" and "Absence" rows
      const ableSelected = newSelected.filter((n: string) => n !== 'Indirect' && n !== 'Absence');

      setSelected(ableSelected);
      return;
    }
    setSelected([]);
  };

  /**
   * this method is used to handle select single project event.
   * @param event
   * @param name
   */
  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    // remove "Indirect" and "Absence"
    setSelected(
      newSelected.filter((d) => {
        return d !== 'Indirect' && d !== 'Absence';
      })
    );
  };

  // when name === "Indirect" or "Absence", set isSelected to false
  const isSelected = (name: string) => {
    return selected.indexOf(name) !== -1 && name !== 'Indirect' && name !== 'Absence';
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
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <EnhancedTableHead numSelected={selected.length} onSelectAllClick={handleSelectAllClick} rowCount={rows.length} />
            <TableBody>
              {rows.map((row: Data, index: number) => {
                const isItemSelected = isSelected(row.name);
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <TableRow hover role="checkbox" aria-checked={isItemSelected} tabIndex={-1} key={row.name} selected={isItemSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        onClick={(event) => handleClick(event, row.name)}
                        inputProps={{
                          'aria-labelledby': labelId
                        }}
                        disabled={row.name === 'Indirect' || row.name === 'Absence'}
                      />
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row" padding="none">
                      {row.name}
                    </TableCell>
                    <TableCell align="left" sx={{ width: '180px', paddingRight: '3rem', paddingLeft: '0' }}>
                      <Formik validateOnChange={true} initialValues={initialHours} validationSchema={FormValidation} enableReinitialize={true} onSubmit={() => {}}>
                        <Form>
                          <FormObserver employee={data.employeeData} project={row} date={date} setLoading={setLoading} />
                          <TextInput id="hours" name="hours" type="number" label="Hours" variant="outlined" InputProps={{ inputProps: { min: 0 } }} required />
                        </Form>
                      </Formik>
                    </TableCell>
                    <TableCell align="left" sx={{ width: '150px', paddingRight: '3rem' }}>
                      {row.previousWeek ? row.previousWeek : '0'}
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
