import React, { FC } from 'react';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';

import { EnhancedTableToolbar } from '@pages/Employee/components/table/EnhancedTableToolbar';
import { EnhancedTableHead } from '@pages/Employee/components/table/EnhencedTableHead';
import { EmployeeModel } from '@graphql/graphql';
import { Paths } from '@constants/paths';

interface EmployeeTableProps {
  rows: EmployeeModel[];
}

export const EmployeeTable: FC<EmployeeTableProps> = ({ rows }) => {
  const [selected, setSelected] = React.useState<readonly string[]>([]);

  /**
   * this method is used to handle select all employees' event.
   * @param event
   */
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  /**
   * this method is used to handle select single employee event.
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

    setSelected(newSelected);
  };

  const isSelected = (name: string) => {
    return selected.indexOf(name) !== -1;
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
              {rows.map((row, index) => {
                const isItemSelected = isSelected(row.name);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ '& .MuiTableCell-root': { fontWeight: 'medium' } }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        onClick={(event) => handleClick(event, row.name)}
                        inputProps={{
                          'aria-labelledby': labelId
                        }}
                      />
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row" padding="none" sx={{ width: '100px', paddingRight: '3rem', paddingLeft: '0' }}>
                      {row.name}
                    </TableCell>
                    <TableCell align="left" sx={{ width: '100px', paddingRight: '3rem', paddingLeft: '0' }}>
                      {row.email}
                    </TableCell>
                    <TableCell align="left" sx={{ width: '100px', paddingRight: '3rem' }}>
                      {row.rate}
                    </TableCell>
                    <TableCell align="left" sx={{ border: 'none', width: '100px', underline: 'none' }}>
                      <Button variant="outlined" href={`${Paths.EMPLOYEE_lIST}/${row.id}`}>
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {rows.length == 0 && (
          <Button sx={{ width: '100%', height: '200px', fontSize: '1.2rem' }} href={Paths.ADD_EMPLOYEE}>
            Add Your First Employee
          </Button>
        )}
      </Paper>
    </Box>
  );
};
