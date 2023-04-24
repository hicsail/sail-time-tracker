import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Chip, TableBody, Table, TableCell, TableContainer, TableRow, Paper, Checkbox, Button } from '@mui/material';

import { EnhancedTableToolbar } from '@pages/Employee/components/table/EnhancedTableToolbar';
import { EnhancedTableHead } from '@pages/Employee/components/table/EnhencedTableHead';
import { Paths } from '@constants/paths';
import { FormDialog } from '@components/form/FormDialog';
import { GetEmployeeListQuery } from '@graphql/employee/employee';
import { EmployeeForm } from '@pages/Employee/components/form/EmployeeForm';

interface EmployeeTableProps {
  data: GetEmployeeListQuery | undefined;
}

export const EmployeeTable: FC<EmployeeTableProps> = ({ data }) => {
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const rows = data?.employees ? data.employees : [];

  const handleClickOpen = () => {
    setOpen(true);
  };

  /**
   * close Model and navigate to Track Page
   */
  const handleClose = () => {
    setOpen(false);
    navigate(Paths.EMPLOYEE_lIST);
  };

  /**
   * this method is used to handle select all employees' event.
   * @param event
   */
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  /**
   * this method is used to handle select single employee event.
   * @param event
   * @param id
   */
  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
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
              {rows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
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
                        onClick={(event) => handleClick(event, row.id)}
                        inputProps={{
                          'aria-labelledby': labelId
                        }}
                      />
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row" padding="none" sx={{ width: '100px', paddingRight: '3rem', paddingLeft: '0' }}>
                      {row.name}
                    </TableCell>
                    <TableCell align="left" sx={{ width: '100px', paddingLeft: '0' }}>
                      {row.email}
                    </TableCell>
                    <TableCell align="left" sx={{ width: '100px', paddingRight: '3rem' }}>
                      {row.rate}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        width: '100px',
                        paddingRight: '3rem'
                      }}
                    >
                      <Chip
                        label={row.status}
                        sx={{
                          backgroundColor: 'customColors.statusBtnBg',
                          color: 'customColors.statusBtnText',
                          padding: '0 10px'
                        }}
                      />
                    </TableCell>
                    <TableCell align="left" sx={{ border: 'none', width: '100px', underline: 'none' }}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          navigate(`${Paths.EMPLOYEE_lIST}/${row.id}`);
                          handleClickOpen();
                        }}
                      >
                        Edit
                      </Button>
                      <FormDialog open={open} setOpen={setOpen} title="Edit Employee" onClose={handleClose}>
                        <EmployeeForm handleClose={handleClose} />
                      </FormDialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {rows.length == 0 && (
          <Box>
            <Button sx={{ width: '100%', height: '200px', fontSize: '1.2rem' }} onClick={handleClickOpen}>
              Add Your First Employee
            </Button>
            <FormDialog open={open} setOpen={setOpen} title="Edit Employee" onClose={handleClose}>
              <EmployeeForm handleClose={handleClose} />
            </FormDialog>
          </Box>
        )}
      </Paper>
    </Box>
  );
};
