import React from 'react';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';

import { EnhancedTableToolbar } from '@pages/Track/components/table/EnhancedTableToolbar';
import { EnhancedTableHead } from '@pages/Track/components/table/EnhancedTableHead';

export interface Data {
  name: string;
  hours: number;
  previousWeek: number;
  description: string;
}

function createData(name: string, hours: number, previousWeek: number, description: string): Data {
  return {
    name,
    hours,
    previousWeek,
    description
  };
}

// mock rows data
const rows = [
  createData('Indirect', 80, 67, 'Update Meetings, Standup, Classes, etc'),
  createData('Absence', 10, 5, 'Vacation, Sick leave, Holidays etc'),
  createData('ANCHOR', 20, 15, ''),
  createData('ASL-LEX', 10, 15, '')
];

export const ProjectTable = () => {
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [loading, setLoading] = React.useState(false);

  /**
   * this method is used to switch table save state.
   */
  function handleLoadingClick() {
    setLoading(true);
  }

  /**
   * this method is used to handle select all project event.
   * @param event
   */
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);

      // remove "Indirect" and "Absence" rows
      const ableSelected = newSelected.filter((n) => n !== 'Indirect' && n !== 'Absence');

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
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <EnhancedTableHead numSelected={selected.length} onSelectAllClick={handleSelectAllClick} rowCount={rows.length} />
            <TableBody>
              {rows.map((row, index) => {
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
                    <TableCell align="left" sx={{ width: '100px', paddingRight: '3rem', paddingLeft: '0' }}>
                      <TextField id="hours" type="number" label="Hours" variant="outlined" InputProps={{ inputProps: { min: 0 } }} required />
                    </TableCell>
                    <TableCell align="left" sx={{ width: '100px', paddingRight: '3rem' }}>
                      {row.previousWeek}
                    </TableCell>
                    <TableCell align="left">{row.description}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <LoadingButton color="primary" onClick={handleLoadingClick} loading={loading} loadingPosition="start" startIcon={<SaveIcon />} variant="contained">
        <span>Save</span>
      </LoadingButton>
    </Box>
  );
};
