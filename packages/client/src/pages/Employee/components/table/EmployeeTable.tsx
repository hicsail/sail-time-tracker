import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Chip, InputAdornment, SelectChangeEvent, Stack, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Typography } from '@mui/material';
import { EnhancedTableHead } from '@pages/Employee/components/table/EnhencedTableHead';
import { Paths } from '@constants/paths';
import { FormDialog } from '@components/form/FormDialog';
import { EmployeeForm } from '@pages/Employee/components/form/EmployeeForm';
import { StyledPaper } from '@components/StyledPaper';
import { DropDownMenu } from '@components/form/DropDownMenu';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { TextInput } from '@components/TextInput';

interface EmployeeTableProps {
  data: any[];
}

export const EmployeeTable: FC<EmployeeTableProps> = ({ data }) => {
  const [open, setOpen] = useState({
    add: false,
    edit: false
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [searchText, setSearchText] = useState<string>('');
  const [rows, setRows] = useState(data ? data : []);
  const [filter, setFilter] = useState<string>('Active');
  const navigate = useNavigate();

  const handleClickOpen = (type: string) => {
    setOpen((prevState) => ({ ...prevState, [type]: true }));
  };

  const handleOnClose = (type: string) => {
    setOpen((prevState) => ({ ...prevState, [type]: false }));
    navigate(Paths.EMPLOYEE_lIST);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  useEffect(() => {
    let filteredRows = data;

    if (searchText && searchText !== '') {
      const searchFilter = (row: any) => row.name.toLowerCase().includes(searchText.toLowerCase());

      filteredRows = filteredRows.filter(searchFilter);
    }

    if (filter && filter !== 'All') {
      const statusFilter = (row: any) => row.status === filter;

      filteredRows = filteredRows.filter(statusFilter);
    }

    setRows(filteredRows);
  }, [searchText, filter, data]);

  useEffect(() => {
    let filteredRows = data;

    if (filter === 'Active') {
      filteredRows = data.filter((row) => row.status === 'Active');
    } else if (filter === 'Inactive') {
      filteredRows = data.filter((row) => row.status === 'Inactive');
    }

    setRows(filteredRows);
  }, [filter, data]);

  const dropdownData = [
    {
      id: 'All',
      name: 'All'
    },
    {
      id: 'Active',
      name: 'Active'
    },
    {
      id: 'Inactive',
      name: 'Inactive'
    }
  ];

  const handleDropdownOnChange = (e: SelectChangeEvent<string>) => {
    setFilter(e.target.value);
  };

  return (
    <Box sx={{ width: '100%', marginTop: 8 }}>
      <StyledPaper elevation={0}>
        <Stack direction="row" justifyContent="space-between" marginBottom={5}>
          <Typography variant="h6">All Employees</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ borderRadius: '8px', backgroundColor: 'grey.800', '&:hover': { backgroundColor: 'grey.700' } }}
            onClick={() => handleClickOpen('add')}
          >
            New Employee
          </Button>
          <FormDialog open={open.add} onClose={() => handleOnClose('add')}>
            <EmployeeForm handleClose={() => handleOnClose('add')} />
          </FormDialog>
        </Stack>
        <Stack direction="row" gap={2} mb={3}>
          <DropDownMenu data={dropdownData} onChange={handleDropdownOnChange} label="Status" name="employee-status-dropdown" id="employee-status-dropdown" value={filter} />
          <TextInput
            value={searchText}
            setValue={setSearchText}
            id="search-employee"
            variant="outlined"
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ mr: 1, color: 'grey.500' }} />
                </InputAdornment>
              )
            }}
          />
        </Stack>
        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <EnhancedTableHead />
            <TableBody>
              {visibleRows.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <TableRow hover tabIndex={-1} key={row.id} sx={{ '& .MuiTableCell-root': { fontWeight: 'medium', borderBottom: '1px dashed', borderColor: 'grey.200' } }}>
                    <TableCell component="th" id={labelId} scope="row" sx={{ width: '100px' }}>
                      {row.name}
                    </TableCell>
                    <TableCell align="left" sx={{ width: '100px' }}>
                      {row.email}
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
                          padding: '0 10px',
                          borderRadius: '8px'
                        }}
                      />
                    </TableCell>
                    <TableCell align="left" sx={{ width: '100px' }}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          navigate(`${Paths.EMPLOYEE_lIST}/${row.id}`);
                          handleClickOpen('edit');
                        }}
                        color="secondary"
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              <FormDialog open={open.edit} onClose={() => handleOnClose('edit')}>
                <EmployeeForm handleClose={() => handleOnClose('edit')} />
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
            <Button sx={{ width: '100%', height: '200px', fontSize: '1.2rem' }} onClick={() => handleClickOpen('new')}>
              Add Your First Employee
            </Button>
            <FormDialog open={open.add} onClose={() => handleOnClose('add')}>
              <EmployeeForm handleClose={() => handleOnClose('add')} />
            </FormDialog>
          </Box>
        )}
      </StyledPaper>
    </Box>
  );
};
