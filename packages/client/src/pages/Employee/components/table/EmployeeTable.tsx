import React, { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Checkbox, Chip, Paper, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow } from '@mui/material';
import { EnhancedTableToolbar } from '@pages/Employee/components/table/EnhancedTableToolbar';
import { EnhancedTableHead } from '@pages/Employee/components/table/EnhencedTableHead';
import { Paths } from '@constants/paths';
import { FormDialog } from '@components/form/FormDialog';
import { EmployeeForm } from '@pages/Employee/components/form/EmployeeForm';
import TextField from '@mui/material/TextField';

interface EmployeeTableProps {
  data: any[];
}

export const EmployeeTable: FC<EmployeeTableProps> = ({ data }) => {
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState<string>();
  const [rows, setRows] = useState(data ? data : []);

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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  useEffect(() => {
    if (searchText !== '' && searchText !== undefined) {
      setRows(data.filter((row) => row.name.toLowerCase().includes(searchText.toLowerCase())));
    } else {
      setRows(data);
    }
  }, [searchText]);

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
        <TextField
          id="outlined-basic"
          label="Search Employees"
          variant="outlined"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchText(event.target.value);
          }}
          value={searchText}
        />
        <EnhancedTableToolbar numSelected={selected.length} selected={selected} setSelected={setSelected} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <EnhancedTableHead numSelected={selected.length} onSelectAllClick={handleSelectAllClick} rowCount={rows.length} />
            <TableBody>
              {visibleRows.map((row, index) => {
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
                          backgroundColor: row.status === 'Active' ? 'success.light' : 'error.light',
                          color: row.status === 'Active' ? 'success.main' : 'error.main',
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
                        color="secondary"
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              <FormDialog open={open} title="Edit Employee" onClose={handleClose}>
                <EmployeeForm handleClose={handleClose} />
              </FormDialog>
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        {data.length === 0 && (
          <Box>
            <Button sx={{ width: '100%', height: '200px', fontSize: '1.2rem' }} onClick={handleClickOpen}>
              Add Your First Employee
            </Button>
            <FormDialog open={open} title="Edit Employee" onClose={handleClose}>
              <EmployeeForm handleClose={handleClose} />
            </FormDialog>
          </Box>
        )}
      </Paper>
    </Box>
  );
};
